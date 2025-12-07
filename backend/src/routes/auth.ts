import { Router } from 'express';
import axios from 'axios';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

const router = Router();

// LinkedIn OAuth Configuration

const REDIRECT_URI = 'http://localhost:3000/auth/linkedin/callback';

// 1. Redirect to LinkedIn Auth
router.get('/linkedin', (req, res) => {
    const scope = 'openid profile email'; // Adjust scopes as needed
    const state = Math.random().toString(36).substring(7); // Simple state for demo

    // Access env vars here to ensure they are loaded
    const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;

    if (!LINKEDIN_CLIENT_ID) {
        return res.status(500).json({ error: 'Server Configuration Error: Missing LINKEDIN_CLIENT_ID' });
    }

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=${encodeURIComponent(scope)}`;

    res.redirect(authUrl);
});

// 2. Callback handling
router.get('/linkedin/callback', async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).json({ error: 'LinkedIn Access Denied' });
    }

    try {
        const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
        const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

        if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
            throw new Error('Missing LinkedIn Credentials in Environment');
        }

        // Exchange code for access token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                client_id: LINKEDIN_CLIENT_ID,
                client_secret: LINKEDIN_CLIENT_SECRET,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // Fetch user profile (OpenID Connect)
        const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const profileData = profileResponse.data;
        const linkedinId = profileData.sub;
        const firstName = profileData.given_name;
        const lastName = profileData.family_name;
        const profilePictureUrl = profileData.picture;

        // Database Integration
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE linkedin_id = ?', [linkedinId]);

        if (rows.length > 0) {
            // User exists, update token
            await pool.query('UPDATE users SET access_token = ?, updated_at = NOW() WHERE linkedin_id = ?', [accessToken, linkedinId]);
        } else {
            // New user, insert
            await pool.query('INSERT INTO users (linkedin_id, access_token, first_name, last_name, profile_picture_url) VALUES (?, ?, ?, ?, ?)',
                [linkedinId, accessToken, firstName, lastName, profilePictureUrl]);
        }

        // Simulating a success page that the extension can detect
        res.send(`
      <html>
        <head>
            <title>Authentication Successful</title>
        </head>
        <body>
          <div id="auth-success-data" 
               data-token="${accessToken}" 
               data-user='${JSON.stringify({ name: `${firstName} ${lastName}`, headline: '' }).replace(/'/g, "&#39;")}'
               style="display:none;"></div>
          
          <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
              <h1>Login Successful!</h1>
              <p>You can verify your profile in the extension.</p>
              <p>Closing this window in 3 seconds...</p>
          </div>

          <script>
            // Attempt postMessage for window.open flows
            try {
                window.opener.postMessage({ type: "LINKEDIN_AUTH_SUCCESS", token: "${accessToken}", user: ${JSON.stringify({ name: `${firstName} ${lastName}`, headline: '' })} }, "*");
            } catch(e) {}
            
            // Auto close fallback
            setTimeout(() => {
                // window.close(); 
            }, 3000);
          </script>
        </body>
      </html>
    `);

    } catch (err: any) {
        console.error('Auth Error:', err.response?.data || err.message);
        res.status(500).json({
            error: 'Authentication Failed',
            details: err.message,
            apiError: err.response?.data
        });
    }
});

export default router;
