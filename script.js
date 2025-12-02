// GPA Calculator logic
// --------------------
// - Supports letter grades (A, A-, B+, ...) and numeric percentages (0-100)
// - Computes weighted GPA on a 4.0 scale using a common conversion chart
// - Provides input validation, dynamic row add/remove, and CSV export

const gradeLetterToPointsMap = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  'D-': 0.7,
  F: 0.0,
};

/**
 * Convert numeric percentage (0-100) to GPA points on a 4.0 scale.
 * This uses a widely used US-style scale.
 */
function percentageToGpa(percentage) {
  if (percentage >= 93) return 4.0; // A
  if (percentage >= 90) return 3.7; // A-
  if (percentage >= 87) return 3.3; // B+
  if (percentage >= 83) return 3.0; // B
  if (percentage >= 80) return 2.7; // B-
  if (percentage >= 77) return 2.3; // C+
  if (percentage >= 73) return 2.0; // C
  if (percentage >= 70) return 1.7; // C-
  if (percentage >= 67) return 1.3; // D+
  if (percentage >= 65) return 1.0; // D
  return 0.0; // F
}

function createCourseRow() {
  const row = document.createElement('div');
  row.className = 'table-row';

  row.innerHTML = `
    <div class="cell-course">
      <input type="text" class="input-course" placeholder="Course name (optional)" />
    </div>
    <div class="cell-type">
      <select class="input-grade-type">
        <option value="letter" selected>Letter</option>
        <option value="percent">Percent</option>
      </select>
    </div>
    <div class="cell-grade">
      <input type="text" class="input-grade" placeholder="A, B+, 92..." />
    </div>
    <div class="cell-credits">
      <input type="number" class="input-credits" min="0" step="0.5" placeholder="3" />
    </div>
    <div class="cell-remove">
      <button class="btn icon-only btn-remove" title="Remove course" aria-label="Remove course">
        &times;
      </button>
    </div>
  `;

  return row;
}

function addInitialRows() {
  const body = document.getElementById('courses-body');
  for (let i = 0; i < 3; i++) {
    body.appendChild(createCourseRow());
  }
}

function clearErrors() {
  const errorsEl = document.getElementById('errors');
  errorsEl.innerHTML = '';

  document
    .querySelectorAll('input.error, select.error')
    .forEach((el) => el.classList.remove('error'));
}

function showErrors(messages) {
  const errorsEl = document.getElementById('errors');
  errorsEl.innerHTML = '';
  messages.forEach((msg) => {
    const p = document.createElement('p');
    p.textContent = msg;
    errorsEl.appendChild(p);
  });
}

/**
 * Parse a single course row into { name, credits, points }
 * Returns { error, highlightElements } when invalid.
 */
function parseRow(row, index) {
  const nameInput = row.querySelector('.input-course');
  const typeSelect = row.querySelector('.input-grade-type');
  const gradeInput = row.querySelector('.input-grade');
  const creditsInput = row.querySelector('.input-credits');

  const rowLabel = nameInput.value.trim() || `Course ${index + 1}`;

  // Parse credits
  const creditsRaw = creditsInput.value.trim();
  const credits = creditsRaw === '' ? NaN : Number(creditsRaw);
  if (Number.isNaN(credits) || credits <= 0) {
    return {
      error: `${rowLabel}: please enter credit hours greater than 0.`,
      highlightElements: [creditsInput],
    };
  }

  const gradeType = typeSelect.value;
  const gradeRaw = gradeInput.value.trim();

  if (!gradeRaw) {
    return {
      error: `${rowLabel}: please enter a grade.`,
      highlightElements: [gradeInput],
    };
  }

  let points;

  if (gradeType === 'letter') {
    const gradeLetter = gradeRaw.toUpperCase();
    if (!(gradeLetter in gradeLetterToPointsMap)) {
      return {
        error: `${rowLabel}: "${gradeRaw}" is not a valid letter grade (use A, A-, B+, ..., F).`,
        highlightElements: [gradeInput, typeSelect],
      };
    }
    points = gradeLetterToPointsMap[gradeLetter];
  } else {
    // percentage
    const num = Number(gradeRaw);
    if (Number.isNaN(num) || num < 0 || num > 100) {
      return {
        error: `${rowLabel}: percentage must be between 0 and 100.`,
        highlightElements: [gradeInput, typeSelect],
      };
    }
    points = percentageToGpa(num);
  }

  return {
    name: nameInput.value.trim(),
    credits,
    points,
  };
}

function calculateGpa() {
  clearErrors();
  const rows = Array.from(document.querySelectorAll('.table-row'));
  const errorMessages = [];
  let totalWeighted = 0;
  let totalCredits = 0;

  rows.forEach((row, index) => {
    const gradeValue = row.querySelector('.input-grade').value.trim();
    const creditsValue = row.querySelector('.input-credits').value.trim();

    // Skip completely empty rows
    if (!gradeValue && !creditsValue) {
      return;
    }

    const parsed = parseRow(row, index);
    if (parsed.error) {
      errorMessages.push(parsed.error);
      parsed.highlightElements.forEach((el) => el.classList.add('error'));
      return;
    }

    totalWeighted += parsed.points * parsed.credits;
    totalCredits += parsed.credits;
  });

  if (errorMessages.length) {
    showErrors(errorMessages);
    hideResult();
    return;
  }

  if (totalCredits === 0) {
    showErrors([
      'Please enter at least one course with valid grade and credits to calculate GPA.',
    ]);
    hideResult();
    return;
  }

  const gpa = totalWeighted / totalCredits;
  showResult(gpa, totalCredits);
}

function showResult(gpa, totalCredits) {
  const resultEl = document.getElementById('result');
  const gpaEl = document.getElementById('gpa-value');
  const noteEl = document.getElementById('result-note');

  gpaEl.textContent = gpa.toFixed(2);
  noteEl.textContent = `Based on ${totalCredits.toFixed(
    1
  )} total credit hours using a 4.0 scale.`;

  resultEl.hidden = false;

  // Trigger animation
  requestAnimationFrame(() => {
    resultEl.classList.add('visible');
  });
}

function hideResult() {
  const resultEl = document.getElementById('result');
  resultEl.classList.remove('visible');
  resultEl.hidden = true;
}

function resetAll() {
  clearErrors();
  hideResult();
  const body = document.getElementById('courses-body');
  body.innerHTML = '';
  addInitialRows();
}

function exportCsv() {
  clearErrors();
  const rows = Array.from(document.querySelectorAll('.table-row'));
  const data = [];

  rows.forEach((row, index) => {
    const course = row.querySelector('.input-course').value.trim();
    const type = row.querySelector('.input-grade-type').value;
    const grade = row.querySelector('.input-grade').value.trim();
    const credits = row.querySelector('.input-credits').value.trim();

    if (!grade && !credits) return;

    const parsed = parseRow(row, index);
    if (parsed.error) {
      // mark invalid fields but still show error message
      parsed.highlightElements.forEach((el) => el.classList.add('error'));
      return;
    }

    data.push({
      course: course || `Course ${index + 1}`,
      gradeType: type === 'letter' ? 'Letter' : 'Percent',
      grade,
      credits: parsed.credits,
      gpaPoints: parsed.points,
    });
  });

  if (!data.length) {
    showErrors(['Nothing to export. Please enter at least one valid course.']);
    return;
  }

  const header = ['Course', 'Grade Type', 'Grade', 'Credits', 'GPA Points'];
  const lines = [header.join(',')];

  data.forEach((row) => {
    const line = [
      row.course.replace(/"/g, '""'),
      row.gradeType,
      row.grade,
      row.credits,
      row.gpaPoints.toFixed(2),
    ]
      .map((value) => `"${value}"`)
      .join(',');
    lines.push(line);
  });

  const blob = new Blob([lines.join('\r\n')], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gpa-courses.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function setupEventListeners() {
  const body = document.getElementById('courses-body');

  document.getElementById('add-course').addEventListener('click', () => {
    body.appendChild(createCourseRow());
  });

  body.addEventListener('click', (e) => {
    if (e.target.closest('.btn-remove')) {
      const row = e.target.closest('.table-row');
      const rows = Array.from(document.querySelectorAll('.table-row'));
      if (rows.length > 1) {
        row.remove();
      } else {
        // Just clear fields if it's the last row
        row.querySelectorAll('input').forEach((input) => {
          input.value = '';
        });
      }
    }
  });

  document.getElementById('calculate').addEventListener('click', calculateGpa);
  document.getElementById('reset').addEventListener('click', resetAll);
  document.getElementById('export').addEventListener('click', exportCsv);
}

document.addEventListener('DOMContentLoaded', () => {
  addInitialRows();
  setupEventListeners();
});


