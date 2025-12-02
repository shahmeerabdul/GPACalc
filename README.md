## GPA Calculator (4.0 Scale)

An elegant, minimalistic GPA Calculator that runs in your browser.  
Supports **letter grades (A, A-, B+, …)** or **numeric percentages (0–100)**, with **credit hours weighting** and a **standard 4.0 scale**.

---

### How to run

- **Option 1 – Open directly**
  - Double‑click `index.html` (or open it in any modern browser: Chrome, Edge, Firefox, Safari).
  - No build step, backend, or dependencies required.

- **Option 2 – Local server (optional, recommended)**
  - From the project folder, run a simple static server, e.g. with Python:

```bash
python -m http.server 8000
```

  - Then open `http://localhost:8000` in your browser.

---

### Features

- **Clean, modern UI**
  - Dark, minimal layout with modern typography and soft gradients.
  - Responsive design: works well on desktop and mobile screens.

- **Flexible grade input**
  - For each course you can enter:
    - **Course name** (optional)
    - **Grade type**: Letter or Percent
    - **Grade value**
      - Letter example: `A`, `A-`, `B+`, `C`, `F`, etc.
      - Percent example: `92`, `87.5`, etc.
    - **Credit hours** (or weight) – e.g. `3`, `4`, `1.5`.

- **Robust GPA calculation**
  - Uses the standard weighted formula:
    - \(\text{GPA} = \frac{\sum (\text{course credits} \times \text{grade points})}{\sum \text{course credits}}\)
  - **Letter → GPA** mapping (4.0 scale):
    - A / A+ → 4.0
    - A- → 3.7
    - B+ → 3.3
    - B → 3.0
    - B- → 2.7
    - C+ → 2.3
    - C → 2.0
    - C- → 1.7
    - D+ → 1.3
    - D → 1.0
    - D- → 0.7
    - F → 0.0
  - **Percent → GPA** is converted via common US-style ranges, for example:
    - 93–100 → 4.0 (A)
    - 90–92 → 3.7 (A-)
    - 87–89 → 3.3 (B+)
    - …

- **Dynamic course list**
  - `Add another course` to insert new rows.
  - Remove a row with the × button (the last remaining row just clears instead of disappearing).

- **Validation & feedback**
  - Checks:
    - Credits > 0
    - Letter grade is valid (A, A-, B+, …, F)
    - Percent between 0 and 100
  - Errors are shown in a compact list and offending fields are highlighted.

- **Result display**
  - Shows **GPA with two decimals** (e.g. `3.76 / 4.00`).
  - Also shows the **total credit hours** used in the calculation.
  - Smooth fade‑in animation for the result card.

- **Utility actions**
  - **Reset**: clears all rows and restores three blank course entries.
  - **Export as CSV**: downloads a CSV file of your current table, including:
    - Course name
    - Grade type
    - Grade entered
    - Credits
    - GPA points for that course

---

### File structure

- `index.html` – Main HTML page (layout & containers).
- `styles.css` – Styling, layout, responsive behavior, and animations.
- `script.js` – GPA logic, validation, dynamic rows, and CSV export.
- `README.md` – This documentation.

---

### Example usage

1. Open the app in your browser.
2. For each course row:
   - Optionally type a **Course name** (e.g. `Calculus I`).
   - Choose **Letter** or **Percent**.
   - Enter your grade (e.g. `A-` or `91`).
   - Enter **Credits** (e.g. `3` or `4`).
3. Click **Calculate GPA**.
4. Read the result card:
   - Example: `Your GPA: 3.76 / 4.00`
   - Note: `Based on 15.0 total credit hours using a 4.0 scale.`
5. (Optional) Click **Download as CSV** to save your current course table.

---

### Demo / screenshot (description)

Imagine a **dark, glassy card** centered on the page, with:

- A soft gradient background and a heading: **“GPA Calculator”**.
- A tidy table of courses with rounded inputs and smooth focus outlines.
- Primary action buttons in a subtle indigo gradient.
- A compact result pill at the bottom that glows slightly and fades in with your GPA.

You can easily take a screenshot by:

- Filling in some sample courses.
- Pressing **Calculate GPA**.
- Using your OS’s screenshot tool (e.g. **Win + Shift + S** on Windows) to capture the page.



