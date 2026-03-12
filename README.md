# MyoFix

**Myofunctional Therapy Program for Obstructive Sleep Apnea**  
Developed for the [Institute of Sleep Science, Kolkata](https://www.instituteofsleepcience.com)

---

## What This Is

MyoFix is a guided 180-day myofunctional therapy web app for OSA patients. It runs entirely in the browser — no backend, no database, no server costs. Patient accounts and session progress are stored in `localStorage` on the patient's device.

**Features:**
- Patient registration with auto-generated ID (`ISS-XXXXXX`)
- Login/logout with per-account progress isolation
- 6 guided exercises with countdown timer and rep counter
- 180-day session tracker with streak, milestones, and progress bar
- PDF progress report download (via jsPDF)
- Google Sheets adherence logging via Apps Script webhook
- Nutrition guidelines section

---

## Deployment (GitHub Pages)

1. Fork or clone this repo
2. Go to **Settings → Pages**
3. Under **Source**, select `main` branch and `/ (root)` folder
4. Click **Save**
5. Your app will be live at `https://<your-username>.github.io/myofix`

No build step needed. It's a single HTML file.

---

## Google Sheets Integration

Session completions and new registrations are POST'd to a Google Apps Script webhook.

### Setup

1. Open a new Google Sheet
2. Go to **Extensions → Apps Script**
3. Paste the contents of [`apps-script/Code.gs`](apps-script/Code.gs)
4. Click **Deploy → New Deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment URL
6. In `index.html`, find this line near the top of the `<script>` block:

```js
const SHEET_WEBHOOK_URL = ""; // << PASTE YOUR APPS SCRIPT URL HERE
```

Paste your URL between the quotes and redeploy/commit.

### Sheet Structure

The script auto-creates two tabs on first run:

| Tab | Columns |
|-----|---------|
| **Registrations** | Timestamp, Patient ID, First Name, Last Name, Age, Email, Registered At |
| **Sessions** | Timestamp, Date, Patient ID, First Name, Last Name, Age, Email, Total Days, Streak, Milestones Achieved |

---

## Security Note

This app uses `localStorage` for auth — credentials are stored in plaintext on the patient's browser. This is appropriate for a clinical support tool with no sensitive medical data, but **not** suitable for storing PHI or anything requiring HIPAA compliance. For a hardened production version, replace the auth layer with a proper backend (Firebase Auth, Supabase, etc.).

Passwords are not hashed. Patients should be advised to use a unique password they don't reuse elsewhere.

---

## Tech Stack

| Concern | Solution |
|---------|----------|
| Fonts | Sora + DM Sans + DM Mono (Google Fonts) |
| Icons | [Phosphor Icons](https://phosphoricons.com) |
| PDF export | [jsPDF](https://github.com/parallax/jsPDF) |
| Auth & data | Browser `localStorage` |
| Logging | Google Apps Script webhook |
| Hosting | GitHub Pages |

---

## Customisation

- **Webhook URL:** `const SHEET_WEBHOOK_URL` at the top of the `<script>` block
- **Exercise videos:** Replace each `.exercise-video-placeholder` div with a `<video>` or `<iframe>` element per exercise
- **Branding:** The ISS logo is embedded as a base64 SVG. Replace the `src` on `.navbar-logo img` to swap it out

---

## License

Internal clinical tool. Not licensed for public redistribution.  
&copy; Institute of Sleep Science, Kolkata.
