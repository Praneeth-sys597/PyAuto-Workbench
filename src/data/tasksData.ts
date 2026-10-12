export interface TaskDefinition {
  id: 'file_mover' | 'email_extractor' | 'web_scraper';
  title: string;
  tagline: string;
  shortDesc: string;
  badge: string;
  iconName: string;
  concepts: string[];
  beginnerCode: string;
  advancedCode: string;
  explanation: {
    title: string;
    steps: { step: string; code: string; desc: string }[];
    coreFunctions: { name: string; lib: string; purpose: string; example: string }[];
  };
}

export const TASKS_DATA: Record<string, TaskDefinition> = {
  file_mover: {
    id: 'file_mover',
    title: 'Idea 1: Move .jpg Files to New Folder',
    tagline: 'Automate directory sorting and file relocation',
    shortDesc: 'Scans a target directory, filters all images ending with .jpg, and safely moves them into a dedicated destination folder.',
    badge: 'os + shutil',
    iconName: 'FolderArchive',
    concepts: ['os', 'shutil', 'os.path', 'file handling'],
    beginnerCode: `import os
import shutil

# 1. Define paths for source and destination folders
SOURCE_DIR = "./downloads"
DEST_DIR = "./jpg_photos"

# 2. Create the destination directory if it doesn't already exist
if not os.path.exists(DEST_DIR):
    os.makedirs(DEST_DIR)
    print(f"Created destination directory: {DEST_DIR}")

# 3. List all files in the source folder
files = os.listdir(SOURCE_DIR)
moved_count = 0

# 4. Iterate through files, identify .jpg files, and move them
for filename in files:
    # Case-insensitive check for .jpg
    if filename.lower().endswith(".jpg"):
        source_path = os.path.join(SOURCE_DIR, filename)
        dest_path = os.path.join(DEST_DIR, filename)

        # Move file using shutil.move
        shutil.move(source_path, dest_path)
        print(f"Moved: {filename} -> {DEST_DIR}/")
        moved_count += 1

print(f"\\nDone! Successfully moved {moved_count} .jpg files.")
`,
    advancedCode: `import os
import shutil
import argparse
from pathlib import Path
from datetime import datetime

def move_files_by_extension(source_dir: str, dest_dir: str, extension: str = ".jpg") -> int:
    """
    Safely moves all files with specified extension from source to destination.
    Handles filename collisions and non-existent directories.
    """
    src_path = Path(source_dir).resolve()
    dst_path = Path(dest_dir).resolve()

    if not src_path.is_dir():
        raise FileNotFoundError(f"Source folder does not exist: {src_path}")

    # Ensure destination exists
    dst_path.mkdir(parents=True, exist_ok=True)

    moved_count = 0
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Scanning '{src_path}' for *{extension}...")

    for entry in src_path.iterdir():
        if entry.is_file() and entry.suffix.lower() == extension.lower():
            target = dst_path / entry.name

            # Collision prevention: append timestamp if file already exists
            if target.exists():
                stem = entry.stem
                timestamp = int(datetime.now().timestamp())
                target = dst_path / f"{stem}_{timestamp}{entry.suffix}"

            shutil.move(str(entry), str(target))
            print(f"  -> Relocated: {entry.name} -> {target.name}")
            moved_count += 1

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Complete: {moved_count} file(s) relocated.")
    return moved_count

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Automate moving specific image extensions.")
    parser.add_argument("--source", default="./downloads", help="Source folder path")
    parser.add_argument("--dest", default="./organized_jpgs", help="Destination folder path")
    parser.add_argument("--ext", default=".jpg", help="File extension to filter (e.g. .jpg)")
    args = parser.parse_args()

    move_files_by_extension(args.source, args.dest, args.ext)
`,
    explanation: {
      title: 'How File Movement Automation Works in Python',
      steps: [
        {
          step: '1. Importing Required Modules',
          code: 'import os\nimport shutil',
          desc: '`os` provides OS-level directory navigation and path manipulation. `shutil` offers high-level file operations including atomic moving and copying.',
        },
        {
          step: '2. Creating Destination Safely',
          code: 'os.makedirs(DEST_DIR, exist_ok=True)',
          desc: 'Ensures the target folder exists. `exist_ok=True` prevents FileExistsError if the folder is already present.',
        },
        {
          step: '3. Reading Folder Contents',
          code: 'files = os.listdir(SOURCE_DIR)',
          desc: 'Returns a list containing the names of all entries (files and subdirectories) inside the source folder.',
        },
        {
          step: '4. Filtering for Target Extension',
          code: 'if filename.lower().endswith(".jpg"):',
          desc: 'Converts extension to lowercase so both .jpg and .JPG are matched reliably.',
        },
        {
          step: '5. Moving the File via shutil',
          code: 'shutil.move(source_path, dest_path)',
          desc: 'Transfers the physical file to the destination path. If on different filesystems, shutil automatically copies then deletes the original.',
        },
      ],
      coreFunctions: [
        {
          name: 'os.listdir(path)',
          lib: 'os',
          purpose: 'Lists all filenames inside a directory',
          example: 'files = os.listdir("./downloads")',
        },
        {
          name: 'os.path.join(a, b)',
          lib: 'os',
          purpose: 'Cross-platform path concatenation (handles / vs \\ automatically)',
          example: 'path = os.path.join(folder, filename)',
        },
        {
          name: 'os.makedirs(path, exist_ok=True)',
          lib: 'os',
          purpose: 'Creates directory and any required parent directories',
          example: 'os.makedirs("./images/2026", exist_ok=True)',
        },
        {
          name: 'shutil.move(src, dst)',
          lib: 'shutil',
          purpose: 'Recursively moves a file or directory to another location',
          example: 'shutil.move("old_path.jpg", "new_path.jpg")',
        },
      ],
    },
  },

  email_extractor: {
    id: 'email_extractor',
    title: 'Idea 2: Extract Emails from .txt File',
    tagline: 'Harvest and sanitize contact emails using regular expressions',
    shortDesc: 'Parses unstructured text files, identifies valid email patterns using Python regex, deduplicates results, and exports clean lists.',
    badge: 're + file handling',
    iconName: 'MailCheck',
    concepts: ['re', 'file handling', 'context manager', 'set deduplication'],
    beginnerCode: `import re

# 1. Define input and output filenames
INPUT_FILE = "contacts_raw.txt"
OUTPUT_FILE = "extracted_emails.txt"

# 2. Standard regex pattern to match email addresses
# Matches: username + @ + domain name + .tld
EMAIL_REGEX = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'

# 3. Read raw content using Python's 'with' context manager
with open(INPUT_FILE, "r", encoding="utf-8") as file:
    content = file.read()

# 4. Find all email occurrences
found_emails = re.findall(EMAIL_REGEX, content)

# 5. Remove duplicates and sort alphabetically
unique_emails = sorted(list(set(found_emails)))

# 6. Save extracted emails into the output file
with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
    for email in unique_emails:
        file.write(email + "\\n")

print(f"Extraction Complete!")
print(f"Found {len(found_emails)} matches, saved {len(unique_emails)} unique emails to {OUTPUT_FILE}")
`,
    advancedCode: `import re
import csv
from pathlib import Path
from collections import Counter

# RFC 5322 compliant practical regex
EMAIL_REGEX = re.compile(
    r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,7}\\b'
)

def extract_and_export_emails(input_path: str, output_txt: str = "emails.txt", output_csv: str = "emails.csv"):
    """
    Extracts emails, performs frequency analysis, and exports both TXT and CSV formats.
    """
    path = Path(input_path)
    if not path.is_file():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    with path.open("r", encoding="utf-8", errors="ignore") as f:
        text = f.read()

    # Find all matches
    matches = [email.lower() for email in EMAIL_REGEX.findall(text)]
    counts = Counter(matches)

    # 1. Write clean unique list to TXT
    with open(output_txt, "w", encoding="utf-8") as txt_out:
        for email in sorted(counts.keys()):
            txt_out.write(f"{email}\\n")

    # 2. Write detailed breakdown to CSV
    with open(output_csv, "w", newline="", encoding="utf-8") as csv_out:
        writer = csv.writer(csv_out)
        writer.writerow(["Email", "Domain", "Frequency"])
        for email, freq in counts.most_common():
            domain = email.split("@")[1]
            writer.writerow([email, domain, freq])

    print(f"Harvested {len(matches)} total email instances.")
    print(f"Generated {output_txt} ({len(counts)} unique) and {output_csv}.")

if __name__ == "__main__":
    extract_and_export_emails("contacts_raw.txt")
`,
    explanation: {
      title: 'How Regex & File Handling Work in Python',
      steps: [
        {
          step: '1. Safe File Reading with `with open`',
          code: 'with open("file.txt", "r", encoding="utf-8") as f:\n    content = f.read()',
          desc: 'The context manager (`with`) automatically closes the file even if an unexpected exception occurs during parsing.',
        },
        {
          step: '2. The Regex Anatomy',
          code: "r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'",
          desc: '`[a-zA-Z0-9._%+-]+` matches local email username. `@` matches the literal symbol. Domain name matches alphanumeric, hyphen, or dot, ending with at least 2 alpha characters for TLD (e.g. .com, .edu).',
        },
        {
          step: '3. `re.findall()` Execution',
          code: 'matches = re.findall(EMAIL_REGEX, content)',
          desc: 'Scans the entire string from start to finish and returns a list of all non-overlapping matches.',
        },
        {
          step: '4. Deduplication with `set()`',
          code: 'unique_emails = sorted(list(set(found_emails)))',
          desc: 'Python sets only allow unique elements. Converting the list into a set drops identical emails, and `sorted()` sorts them alphabetically.',
        },
        {
          step: '5. Writing Results to Disk',
          code: 'with open("output.txt", "w") as f:\n    for email in unique_emails:\n        f.write(email + "\\n")',
          desc: 'Opens the file in write mode (`"w"`), clearing any previous content, and streams each clean email on a newline.',
        },
      ],
      coreFunctions: [
        {
          name: 're.findall(pattern, string)',
          lib: 're',
          purpose: 'Finds all substrings matching a regex pattern',
          example: 'emails = re.findall(r"\\S+@\\S+", text)',
        },
        {
          name: 'open(file, mode, encoding)',
          lib: 'built-in',
          purpose: 'Opens file stream with specified mode (r, w, a)',
          example: 'with open("log.txt", "r", encoding="utf-8") as f:',
        },
        {
          name: 'set(iterable)',
          lib: 'built-in',
          purpose: 'Constructs an unordered collection of distinct elements',
          example: 'unique_list = list(set(duplicates))',
        },
      ],
    },
  },

  web_scraper: {
    id: 'web_scraper',
    title: 'Idea 3: Scrape Webpage Title & Save It',
    tagline: 'HTTP web client automation and HTML title extraction',
    shortDesc: 'Sends HTTP GET requests with custom user headers, extracts the <title> tag using regex or BeautifulSoup, and appends to a local archive.',
    badge: 'requests + re / bs4',
    iconName: 'Globe',
    concepts: ['requests', 're', 'HTTP status codes', 'file handling'],
    beginnerCode: `import requests
import re

# 1. Target webpage URL to scrape
URL = "https://www.python.org"
OUTPUT_FILE = "webpage_title.txt"

# 2. Set User-Agent headers to mimic a genuine browser request
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

print(f"Connecting to {URL}...")

try:
    # 3. Send HTTP GET request
    response = requests.get(URL, headers=headers, timeout=10)
    
    # 4. Check that response was successful (HTTP 200 OK)
    response.raise_for_status()
    
    # 5. Extract <title> content using Regex (re module)
    # The regex looks for <title> then captures everything inside until </title>
    title_match = re.search(r"<title>(.*?)</title>", response.text, re.IGNORECASE | re.DOTALL)
    
    if title_match:
        # Strip whitespace or newline characters
        page_title = title_match.group(1).strip()
        print(f"Extracted Title: \\"{page_title}\\"")
        
        # 6. Save the title to a text file
        with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
            file.write(f"URL: {URL}\\n")
            file.write(f"Status: {response.status_code}\\n")
            file.write(f"Title: {page_title}\\n")
            
        print(f"Saved successfully to '{OUTPUT_FILE}'.")
    else:
        print("Error: No <title> tag found in HTML response.")

except requests.exceptions.RequestException as error:
    print(f"Network / HTTP Error occurred: {error}")
`,
    advancedCode: `import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
import csv

PAGES_TO_SCRAPE = [
    "https://www.python.org",
    "https://en.wikipedia.org/wiki/Python_(programming_language)",
    "https://github.com/trending",
]

OUTPUT_LOG = "scraped_titles_log.txt"

def scrape_webpage(url: str):
    headers = {
        "User-Agent": "PyAutoBot/1.0 (+https://example.com/automation-bot)"
    }
    
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        
        # Parse using BeautifulSoup
        soup = BeautifulSoup(resp.text, "html.parser")
        title = soup.title.string.strip() if soup.title else "No Title Found"
        
        meta_desc = soup.find("meta", attrs={"name": "description"})
        description = meta_desc["content"].strip() if meta_desc and "content" in meta_desc.attrs else "None"
        
        record = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "url": url,
            "status": resp.status_code,
            "title": title,
            "description": description[:120] + "..." if len(description) > 120 else description
        }
        
        # Append to log file
        with open(OUTPUT_LOG, "a", encoding="utf-8") as f:
            f.write(f"[{record['timestamp']}] ({record['status']}) {record['title']} | {record['url']}\\n")
            
        return record
        
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch {url}: {e}")
        return None

if __name__ == "__main__":
    results = []
    for site in PAGES_TO_SCRAPE:
        res = scrape_webpage(site)
        if res:
            results.append(res)
            print(f"Scraped: '{res['title']}'")
            
    print(f"\\nBatch scraping finished. Appended records to {OUTPUT_LOG}")
`,
    explanation: {
      title: 'How Web Scraping & Requests Work in Python',
      steps: [
        {
          step: '1. Sending HTTP Request',
          code: 'response = requests.get(url, headers=headers, timeout=10)',
          desc: '`requests.get()` contacts the remote web server and downloads the HTTP response object containing HTML, headers, and status code.',
        },
        {
          step: '2. Setting User-Agent Header',
          code: 'headers = {"User-Agent": "Mozilla/5.0..."}',
          desc: 'Many modern websites block default Python scripts (`User-Agent: python-requests/2.x`). A standard browser header avoids 403 Forbidden errors.',
        },
        {
          step: '3. Validating HTTP Status Code',
          code: 'response.raise_for_status()',
          desc: 'Throws an HTTPError if the response was an HTTP error (4xx or 5xx). Prevents parsing error pages like 404 Not Found as valid titles.',
        },
        {
          step: '4. Title Extraction with Regex',
          code: 're.search(r"<title>(.*?)</title>", response.text, re.IGNORECASE)',
          desc: 'Regex searches for `<title>` tags regardless of case (`re.IGNORECASE`). `(.*?)` is a non-greedy capture group that isolates the inner title string.',
        },
        {
          step: '5. Writing to File with Timestamps',
          code: 'with open("webpage_title.txt", "w", encoding="utf-8") as f:\n    f.write(f"Title: {title}\\n")',
          desc: 'Saves the clean title along with metadata into a text file using persistent file handling.',
        },
      ],
      coreFunctions: [
        {
          name: 'requests.get(url, ...)',
          lib: 'requests',
          purpose: 'Dispatches HTTP GET request to specified endpoint',
          example: 'resp = requests.get("https://example.com")',
        },
        {
          name: 'response.raise_for_status()',
          lib: 'requests',
          purpose: 'Raises an exception if HTTP code indicates error (400-599)',
          example: 'resp.raise_for_status()',
        },
        {
          name: 're.search(pattern, string)',
          lib: 're',
          purpose: 'Scans string for the first location where pattern produces a match',
          example: 'match = re.search(r"<title>(.*?)</title>", html)',
        },
      ],
    },
  },
};

export const INITIAL_FILES: Array<{ name: string; sizeKb: number; folder: 'source' | 'destination' }> = [
  { name: 'family_holiday_2026.jpg', sizeKb: 3420, folder: 'source' },
  { name: 'quarterly_financial_report.pdf', sizeKb: 1250, folder: 'source' },
  { name: 'sunset_horizon_photo.jpg', sizeKb: 4180, folder: 'source' },
  { name: 'meeting_notes_draft.txt', sizeKb: 18, folder: 'source' },
  { name: 'profile_avatar_hq.png', sizeKb: 890, folder: 'source' },
  { name: 'camera_capture_001.jpg', sizeKb: 2840, folder: 'source' },
  { name: 'client_contract_signed.docx', sizeKb: 420, folder: 'source' },
  { name: 'desktop_wallpaper_lake.jpg', sizeKb: 5120, folder: 'source' },
  { name: 'podcast_episode_final.mp3', sizeKb: 18400, folder: 'source' },
  { name: 'nature_wildlife_macro.jpg', sizeKb: 3890, folder: 'source' },
];

export const SAMPLE_TEXT_FILES: Record<string, { title: string; content: string }> = {
  client_inquiries: {
    title: 'Customer Inquiries & Support Logs',
    content: `Support Ticket Dump - March 2026
---------------------------------------------
From: Sarah Jenkins (sarah.jenkins@acme-corp.com)
Regarding: Account renewal for team license.
CC: billing-team@acme-corp.com, supervisor.mike@acme-corp.com

Follow-up note from external contractor:
"Please reach out to dev-support@techstart.io or alex.dev99@gmail.com for API key reactivation."

Additional lead list received:
- David Copper (d.copper@financehub.org)
- Marketing inquiries: contact.marketing@growthscale.co
- Personal backup email: sarah.jenkins@acme-corp.com (duplicate entry)
- Help desk: support@techstart.io
- Invalid email test: invalid-email-without-at.com
- Another duplicate: alex.dev99@gmail.com
- Urgent alert contact: security-ops@cloudinfra.net

Report closed by admin: admin@portal.internal.net
`,
  },
  conference_attendees: {
    title: 'Python Developers Conference Registration',
    content: `PyCon Tech Summit Attendees Export
==========================================
1. Guido van Rossum (fan club chair): guido.fan@pythonista.dev
2. Priya Sharma: priya.sharma@deeplearning.ai (Workshop Speaker)
3. John Doe: john.doe@university.edu
4. Jane Smith: jane.smith@googlemail.com
5. Inquiries: registration@pycon-summit.org
6. Sponsor liaison: sponsors@pycon-summit.org
7. Organizer contact: john.doe@university.edu (Duplicate from session 2)
8. Speaker support: speakers-help@pycon-summit.org
9. Press contact: media.relations@presswire.com
`,
  },
  server_error_log: {
    title: 'Server Error & Notification Log',
    content: `[2026-03-28 09:14:22] CRITICAL: Database connection dropped on node-east-1.
Alert notification dispatched to:
- Primary on-call engineer: devops-oncall@infra-alert.io
- Escalation manager: rachel.green@datacenter.org
- Backup paging address: ops-bot@alerts.monitoring.net
[2026-03-28 09:14:45] Customer support notified via support-escalate@infra-alert.io
[2026-03-28 09:15:10] Log reviewed by: rachel.green@datacenter.org (re-verified)
Contact devops-oncall@infra-alert.io for post-mortem meeting.
`,
  },
};

export const SAMPLE_WEB_TARGETS = [
  {
    url: 'https://www.python.org',
    name: 'Python Official Website',
    simulatedStatus: 200,
    simulatedTitle: 'Welcome to Python.org',
    simulatedMeta: 'The official home of the Python Programming Language, documentation, downloads, and community.',
    simulatedHtml: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Welcome to Python.org</title>
  <meta name="description" content="The official home of the Python Programming Language, documentation, downloads, and community.">
  <link rel="stylesheet" href="/static/style.css">
</head>
<body>
  <header><h1>Python</h1></header>
  <main><p>Python is a programming language that lets you work quickly and integrate systems more effectively.</p></main>
</body>
</html>`,
  },
  {
    url: 'https://en.wikipedia.org/wiki/Automation',
    name: 'Wikipedia - Automation Article',
    simulatedStatus: 200,
    simulatedTitle: 'Automation - Wikipedia',
    simulatedMeta: 'Automation describes a wide range of technologies that reduce human intervention in processes.',
    simulatedHtml: `<!DOCTYPE html>
<html class="client-nojs" lang="en">
<head>
  <meta charset="UTF-8">
  <title>Automation - Wikipedia</title>
  <meta name="description" content="Automation describes a wide range of technologies that reduce human intervention in processes.">
</head>
<body>
  <h1>Automation</h1>
  <p>Automation describes a wide range of technologies that reduce human intervention in processes.</p>
</body>
</html>`,
  },
  {
    url: 'https://github.com/trending',
    name: 'GitHub Trending Repositories',
    simulatedStatus: 200,
    simulatedTitle: 'Trending repositories on GitHub today · GitHub',
    simulatedMeta: 'See what the GitHub community is most excited about today.',
    simulatedHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Trending repositories on GitHub today · GitHub</title>
  <meta name="description" content="See what the GitHub community is most excited about today.">
</head>
<body>
  <div>Explore trending repositories across open-source communities.</div>
</body>
</html>`,
  },
  {
    url: 'https://news.ycombinator.com',
    name: 'Hacker News Frontpage',
    simulatedStatus: 200,
    simulatedTitle: 'Hacker News',
    simulatedMeta: 'A social news website focusing on computer science and entrepreneurship.',
    simulatedHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Hacker News</title>
  <meta name="description" content="A social news website focusing on computer science and entrepreneurship.">
</head>
<body>
  <table id="hnmain"><tr><td>Top Stories</td></tr></table>
</body>
</html>`,
  },
];
