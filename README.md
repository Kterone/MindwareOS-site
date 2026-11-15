# MindwareOS website

Static cyberpunk-styled site for [MindwareOS](https://github.com/Kterone/MindwareOS). No build step.

## Files
- `index.html`, `style.css`, `script.js`: the whole site
- `vercel.json`: basic headers

## Deploy on Vercel (via GitHub)
1. Create a new GitHub repo and push these files to the repo root.
2. On vercel.com choose **Add New > Project**, import the repo.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty. Click **Deploy**.

## Download button
The button fetches `install.sh` from
`https://raw.githubusercontent.com/Kterone/MindwareOS/main/install.sh`.
To host the script on the site itself, put `install.sh` in this folder and change the `RAW`
constant at the top of `script.js` to `'/install.sh'`.
