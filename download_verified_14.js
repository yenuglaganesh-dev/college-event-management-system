const fs = require('fs');
const https = require('https');
const path = require('path');

const entries = [
  {
    id: 1,
    title: 'GAJAJYOTI Inauguration 2026',
    date: '2026-01-31',
    displayDate: 'January 31, 2026',
    category: 'Cultural',
    filename: 'cutmap_gajajyoti_inauguration.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczM-2rvwPne_ZTORw-bt4X5-WZ4wipSqHRBIz_bWgaow2ry2gLn7o6Dp-X37QS90Ct5DtOREx9SH4jZeObQTPLACZ8I98VbZNTkXc2EH9Ziv8nZjc-PfhF_NqdAd_0Qg5lIxWvPHf_1I_fUY7WlWSZupuA=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/kZ41vWVZietMZVyU9',
    caption: 'Official Inauguration of Gajajyoti 2026 Annual Inter-College Cultural Festival at CUTM-AP',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 2,
    title: 'Vyomang Day-1',
    date: '2026-02-05',
    displayDate: 'February 5, 2026',
    category: 'Technical',
    filename: 'cutmap_vyomang_day1.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPs35ShTE7tbAlcO1uw2qZUlwdQ-UKpCHze8n3rn54kjJm5EhNffLKPveA9NUSJuPkaZtYREYUbKh5edzjCQPHD4pr_zYaM4rJRnlqGqQnwPZxGuSr0kAj9N-go6MnyxC3b8XIk9SSbuzlCUsBdHDMFYA=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/nhRkvM9JxRJ94Qp49',
    caption: 'Vyomang National Aerospace and Tech Fest Day 1 Opening Keynotes & Drone Demos',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 3,
    title: 'Vyomang Day-2',
    date: '2026-02-06',
    displayDate: 'February 6, 2026',
    category: 'Technical',
    filename: 'cutmap_vyomang_day2.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczOyqIAY2eqMmyuNAWg3c2InVvtoRm4HVHrJRr-6skkoyykb7RZFEronNgCcGKK8YI8q6agxuiHNoNR5_wNHmGF0XWBh6m9tY-vzlx9wYZlNdDCnxfq6YWarvqYH88GXvL00ALJjMuUlhCOEHuuyroHTZw=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/yP47LQPYYfXkDwwT8',
    caption: 'Vyomang Day 2 Innovation Hackathons, Avionics Workshops and Award Presentations',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 4,
    title: 'Public Speaking Competition – Gajajyoti 2026',
    date: '2026-02-09',
    displayDate: 'February 9, 2026',
    category: 'Cultural',
    filename: 'cutmap_public_speaking.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPeYo6k8cPZMxZWJBsa29Gp_7A9yiZMcXbXUK_nBvJIwZoCLroq8AQvFuHO4kS5f1HyR00onB3DsSvAWmHUmXs026jxp9OTCV109oABzbnyj0H3l_zVGnB91suK8HdSLTl4llkrZ80ZLBc-cU-VZXE1QA=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/3nHP58T8tjXvxCJS6',
    caption: 'Inter-Departmental Public Speaking and Elocution Championship for Gajajyoti 2026',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 5,
    title: 'Workshop on Basic Cardio-Pulmonary Life Support',
    date: '2026-02-28',
    displayDate: 'February 28, 2026',
    category: 'Workshop',
    filename: 'cutmap_cardio_pulmonary.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczN7uPgZbJjXXithCU7kRIRZjbELfNNXoDy5ouFwlt08GRw4hlfpJ4zhx9KmXOLJntqtVCCCh82ymwmMLWS2Kk3ape7GJ0aL4ziBisk6AlvhFzPeZyGSvl4mRQBTk5zYjLBryKRQcaqlHIMtWQmlOzY1DA=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/R3Vm1DMhPQRqoPyp8',
    caption: 'School of Paramedics Hands-on Basic Cardio-Pulmonary Resuscitation & Emergency Training',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 6,
    title: 'Pharma Anveshan 2026',
    date: '2026-03-05',
    displayDate: 'March 5, 2026',
    category: 'Conference',
    filename: 'cutmap_pharma_anveshan.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczNv6seP-wRzI7V5eOe9qQtqVlEw6B699mz1_okNgWCkFeMbErcySlTHU4Oobm9mUaqVMqfD4RxKaML0ZWaNaG70REiszieyTYAtuYT2wOKd1uacq7jjIqsD47acvqWqaH5L1-jBEvyayXY1dJcU88UulA=w661-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/6fNVDfyivoJExkdU7',
    caption: 'School of Pharmacy National Symposium on Drug Discovery & Clinical Formulations',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 7,
    title: "Women's Day Celebration 2026",
    date: '2026-03-09',
    displayDate: 'March 9, 2026',
    category: 'Celebration',
    filename: 'cutmap_womens_day_2026.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczMSHx58XykTqH5m0FehZHe62EqxvzZgKe6WVEkCnpYs-IOMb6egJ0CVy65JKZKhxQuCCzuTS-S3u7LCSqvTOv7_PWDQGq7NKUISXSElGcSCd-__kbX3WJKn1qTHsP1BZKVEsXfbjRjbeABH17JDalk-0Q=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/ZKP61ABJrJSTmW7GA',
    caption: 'International Women’s Day celebrations honoring women leaders and achievers at CUTM-AP',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 8,
    title: 'SEMICON ARENA (ECE Day-1)',
    date: '2026-03-17',
    displayDate: 'March 17, 2026',
    category: 'Technical',
    filename: 'cutmap_semicon_day1.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPTdrGZTnUhBULC_d_UkZyrlWe_rph5Q92JbXmeOwXC7qXyrNw5xGmp09BmmkvmML5I8hbbHa5cRpPvEWGDth99pgQ6NxdTBvWjNfUyQK0kh_jnLG8XsLtBHG8HD3XXgvZdkWAYolEb4pGyAxzGS6SjpQ=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/9zxigbqmucg7JW5J6',
    caption: 'Department of ECE Semicon Arena Day 1: Semiconductor fabrication & VLSI design challenges',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 9,
    title: 'SEMICON ARENA (ECE Day-2)',
    date: '2026-03-18',
    displayDate: 'March 18, 2026',
    category: 'Technical',
    filename: 'cutmap_semicon_day2.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczNbBZW8nr55vXZKYblbEniAEQzO2YXfXKHqozmAzCiLvkz14Q9jlzjIuvfay3i06PChbtM7eVn80RR-QUtj3a_ksZIhanNK3fSgEXME11jbxoC-XtCt0NQvrkwyImP9pafFnwRzgggGzGA_hiyLN8FjAQ=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/A4MAv3n1HhtQTgQK7',
    caption: 'Semicon Arena Day 2: Embedded Systems, IoT hardware demos & Industry panel discussions',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 10,
    title: 'Optometry Day',
    date: '2026-03-24',
    displayDate: 'March 24, 2026',
    category: 'Community',
    filename: 'cutmap_optometry_day.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczNzCExtGS285VshLlucOe6NCfN5IMH5UNuBO4qJ5LYy5vc5opRRfMIoIb9J8n5GGgBwSaKiOB6RQOi4-wVw5aV7uPHPDfSS3cyObODmMCd5Pa_TVzboQxqgcs0sXfgG_pJuZsz7paoHE-47OAoYGWUbpA=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/mqSowwZfkyrCTPzi6',
    caption: 'World Optometry Day awareness campaign, diagnostic clinics and vision examinations',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 11,
    title: 'NSS Blood Donation Camp',
    date: '2026-03-25',
    displayDate: 'March 25, 2026',
    category: 'Community',
    filename: 'cutmap_nss_blood_donation.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczOrw2xSaGpi4HQd82xjGwRClGnZz64ppdv4D2Ve3YuXjripqSLPm17M1PllgpQpui9xqnAR3RxvxfHYnvWxMIniJgmx6voa8KqpbNFUDs2RlHrl-udaYiksRHMGJKLKKqBLbMhlwCnT0LqheepwGbf1DQ=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/g8FJbqhbLUAyGM9m8',
    caption: 'Centurion NSS Youth Voluntary Blood Donation Camp with District Red Cross Society',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 12,
    title: 'Dandi March 2.0 (Anti Drug Campaign)',
    date: '2026-04-22',
    displayDate: 'April 22, 2026',
    category: 'Community',
    filename: 'cutmap_dandi_march.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczMuG29-fhsMQkqKOsDKTBeiSMpvJDxSmFKtGnY_lr5bXpkTYzJiJk66CUcWES7RANOscHCTRIx-4m-9CTYFV7YlgzsZxELoGWWtFfRdPkKuJcBZkHh6UoqIZnE6ZE6sOi-c6nHio_1AcWgpmTuGK3HRuA=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/HQmQt2EXEVHmD6Uj9',
    caption: 'Dandi March 2.0 student peace and anti-narcotics community rally across Vizianagaram',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 13,
    title: 'World Quantum Day',
    date: '2026-04-14',
    displayDate: 'April 14, 2026',
    category: 'Conference',
    filename: 'cutmap_quantum_day_2026.jpg',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AP1GczOJb-pZHzIdqrS1rgtRgs5X0afjxe-pM9Hrd79DVQIRpccXLo7fzH4PsXAfOswZY94eYkekMQO27aWwcYzkRLt1v0UfzB97RCoJXO_koWwOioFDku8dS7e3iwN32NlB53dLBCpiZ3jkzkm-d8fluCjhOA=w1487-h991-s-no-gm?authuser=0',
    albumUrl: 'https://photos.app.goo.gl/emQ7fzqsiyB4hU2T9',
    caption: 'World Quantum Day lectures on Quantum Cryptography, Qubits and Quantum Optics at CUTM-AP',
    permissionStatus: 'VERIFIED_OFFICIAL_CUTMAP'
  },
  {
    id: 14,
    title: 'Placement Students 2026',
    date: '2026-05-04',
    displayDate: 'May 4, 2026',
    category: 'Celebration',
    filename: 'cutmap_placement_students.png',
    imgUrl: null, // Placeholder on CUTM AP site (https://placehold.co/600x200), strictly flagged as unavailable
    albumUrl: 'https://photos.app.goo.gl/rCVNRsZ19EHirGaw6',
    caption: 'Official felicitation of CUTM-AP graduating students placed in top MNCs and tech firms',
    permissionStatus: 'UNAVAILABLE'
  }
];

const targetDirPublic = path.join(__dirname, 'frontend-react', 'public', 'cutmap_events');
const targetDirBackend = path.join(__dirname, 'backend', 'src', 'main', 'resources', 'static', 'cutmap_events');

if (!fs.existsSync(targetDirPublic)) fs.mkdirSync(targetDirPublic, { recursive: true });
if (!fs.existsSync(targetDirBackend)) fs.mkdirSync(targetDirBackend, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: Status code ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

// Generate clean SVG for unavailable image
function generateUnavailableBadge(dest) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="#FFF3E9"/>
    <rect x="20" y="20" width="760" height="460" rx="16" fill="#FFFFFF" stroke="#F07824" stroke-width="3" stroke-dasharray="8 8"/>
    <circle cx="400" cy="180" r="50" fill="#FFF3E9" stroke="#F07824" stroke-width="3"/>
    <path d="M400 155v35M400 205v5" stroke="#F07824" stroke-width="4" stroke-linecap="round"/>
    <text x="400" y="270" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#242424" text-anchor="middle">Official Photograph Pending CUTM AP Publication</text>
    <text x="400" y="305" font-family="Arial, sans-serif" font-size="15" fill="#666666" text-anchor="middle">Centurion University of Technology and Management, AP</text>
    <rect x="260" y="340" width="280" height="38" rx="8" fill="#F07824"/>
    <text x="400" y="365" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Official Photo Unavailable / Verified</text>
  </svg>`;
  fs.writeFileSync(dest.replace('.png', '.svg'), svg, 'utf8');
  // Also save as png if needed or point to svg
  return dest.replace('.png', '.svg');
}

async function run() {
  console.log('Downloading 14 verified CUTM AP entries...');
  for (const entry of entries) {
    const pubDest = path.join(targetDirPublic, entry.filename);
    const bkdDest = path.join(targetDirBackend, entry.filename);

    if (entry.imgUrl) {
      console.log(`Downloading [${entry.id}/14] ${entry.title}...`);
      try {
        await downloadFile(entry.imgUrl, pubDest);
        fs.copyFileSync(pubDest, bkdDest);
        console.log(` Saved ${entry.filename} (${fs.statSync(pubDest).size} bytes)`);
      } catch (err) {
        console.error(` Error downloading ${entry.title}:`, err.message);
      }
    } else {
      console.log(`Entry [${entry.id}/14] ${entry.title} has NO official photo. Generating authentic unavailable badge...`);
      const svgPub = generateUnavailableBadge(pubDest);
      const svgBkd = generateUnavailableBadge(bkdDest);
      entry.filename = path.basename(svgPub);
      console.log(` Created ${entry.filename}`);
    }
  }

  // Save the manifest JSON for frontend and database use
  fs.writeFileSync('cutmap_verified_14.json', JSON.stringify(entries, null, 2), 'utf8');
  console.log('Finished downloading all verified entries. Manifest written to cutmap_verified_14.json');
}

run();

