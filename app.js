/**
 * GlucoScan — Frontend Controller & API Integration
 */

document.addEventListener("DOMContentLoaded"), () => {
  // 1. DOM References
  const form = document.getElementById("diabetesPredictionForm");
  const btnPredict = document.getElementById("btnPredict");
  const btnReset = document.getElementById("btnResetForm");

  // Presets
  const btnPresetNormal = document.getElementById("btnPresetNormal");
  const btnPresetElevated = document.getElementById("btnPresetElevated");
  const btnPresetHigh = document.getElementById("btnPresetHigh");

  // Result Containers
  const resultPlaceholder = document.getElementById("resultPlaceholder");
  const resultContent = document.getElementById("resultContent");
  const resultRiskBadge = document.getElementById("resultRiskBadge");
  const resultScore = document.getElementById("resultScore");
  const resultBarFill = document.getElementById("resultBarFill");
  const resultTimestamp = document.getElementById("resultTimestamp");
  const resultSummaryText = document.getElementById("resultSummaryText");
  const resultBreakdownGrid = document.getElementById("resultBreakdownGrid");
  const resultRecsList = document.getElementById("resultRecsList");
  const backendStatusText = document.getElementById("backendStatusText");
  const statusDot = document.getElementById("statusDot");

  // 21 Form Input Fields
  const fields = {
    bmi: document.getElementById("bmi"),
    general_health: document.getElementById("general_health"),
    age_category: document.getElementById("age_category"),
    sex: document.getElementById("sex"),
    physical_health_days: document.getElementById("physical_health_days"),
    mental_health_days: document.getElementById("mental_health_days"),
    high_bp: document.getElementById("high_bp"),
    high_chol: document.getElementById("high_chol"),
    chol_check_5yr: document.getElementById("chol_check_5yr"),
    heart_disease_or_attack: document.getElementById("heart_disease_or_attack"),
    stroke: document.getElementById("stroke"),
    difficulty_walking: document.getElementById("difficulty_walking"),
    phys_activity: document.getElementById("phys_activity"),
    smoker: document.getElementById("smoker"),
    fruits_daily: document.getElementById("fruits_daily"),
    veggies_daily: document.getElementById("veggies_daily"),
    heavy_alcohol: document.getElementById("heavy_alcohol"),
    has_healthcare: document.getElementById("has_healthcare"),
    no_doc_because_cost: document.getElementById("no_doc_because_cost"),
    education_level: document.getElementById("education_level"),
    income_level: document.getElementById("income_level"),
  };

  // 2. Health Check: Test connection to Flask backend
  async function checkBackend() {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/health", { method: "GET" });
      if (res.ok) {
        backendStatusText.textContent = "Python AI Backend Online";
        statusDot.classList.add("online");
      }
    } catch {
      backendStatusText.textContent = "Offline (Run: python app.py)";
      statusDot.classList.remove("online");
    }
  }
  checkBackend();

  // 3. Preset Scenarios
  const presets = {
    normal: {
      bmi: 22.4, general_health: 1, age_category: 4, sex: 0,
      physical_health_days: 0, mental_health_days: 0, high_bp: 0,
      high_chol: 0, chol_check_5yr: 1, heart_disease_or_attack: 0,
      stroke: 0, difficulty_walking: 0, phys_activity: 1, smoker: 0,
      fruits_daily: 1, veggies_daily: 1, heavy_alcohol: 0, has_healthcare: 1,
      no_doc_because_cost: 0, education_level: 6, income_level: 8
    },
    elevated: {
      bmi: 28.5, general_health: 3, age_category: 7, sex: 1,
      physical_health_days: 2, mental_health_days: 1, high_bp: 1,
      high_chol: 0, chol_check_5yr: 1, heart_disease_or_attack: 0,
      stroke: 0, difficulty_walking: 0, phys_activity: 1, smoker: 1,
      fruits_daily: 1, veggies_daily: 1, heavy_alcohol: 0, has_healthcare: 1,
      no_doc_because_cost: 0, education_level: 4, income_level: 6
    },
    high: {
      bmi: 36.5, general_health: 4, age_category: 10, sex: 1,
      physical_health_days: 15, mental_health_days: 5, high_bp: 1,
      high_chol: 1, chol_check_5yr: 1, heart_disease_or_attack: 1,
      stroke: 0, difficulty_walking: 1, phys_activity: 0, smoker: 1,
      fruits_daily: 0, veggies_daily: 1, heavy_alcohol: 0, has_healthcare: 1,
      no_doc_because_cost: 0, education_level: 4, income_level: 4
    }
  };

  function applyPreset(data) {
    Object.keys(data).forEach((key) => {
      if (fields[key]) fields[key].value = data[key];
    });
    clearErrors();
  }

  btnPresetNormal?.addEventListener("click", () => applyPreset(presets.normal));
  btnPresetElevated?.addEventListener("click", () => applyPreset(presets.elevated));
  btnPresetHigh?.addEventListener("click", () => applyPreset(presets.high));

  btnReset?.addEventListener("click", () => {
    form.reset();
    clearErrors();
    resultPlaceholder.style.display = "flex";
    resultContent.style.display = "none";
  });

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
    document.querySelectorAll("input, select").forEach((el) => el.classList.remove("invalid"));
  }

  // 4. Input Validation
  function validateInputs() {
    let isValid = true;
    clearErrors();

    const bmiVal = parseFloat(fields.bmi.value);
    if (isNaN(bmiVal) || bmiVal < 10 || bmiVal > 70) {
      isValid = false;
      fields.bmi.classList.add("invalid");
      document.getElementById("bmiError").textContent = "BMI must be between 10.0 and 70.0 kg/m².";
    }

    const physDays = parseInt(fields.physical_health_days.value, 10);
    if (isNaN(physDays) || physDays < 0 || physDays > 30) {
      isValid = false;
      fields.physical_health_days.classList.add("invalid");
      document.getElementById("physHealthDaysError").textContent = "Must be between 0 and 30 days.";
    }

    const mentDays = parseInt(fields.mental_health_days.value, 10);
    if (isNaN(mentDays) || mentDays < 0 || mentDays > 30) {
      isValid = false;
      fields.mental_health_days.classList.add("invalid");
      document.getElementById("mentHealthDaysError").textContent = "Must be between 0 and 30 days.";
    }

    return isValid;
  }

  // 5. Form Submission -> Fetch Backend /api/predict
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    btnPredict.disabled = true;
    btnPredict.textContent = "Analyzing Clinical Indicators...";

    // Build payload matching the Flask backend
    const payload = {
      high_bp: parseInt(fields.high_bp.value, 10),
      high_chol: parseInt(fields.high_chol.value, 10),
      chol_check_5yr: parseInt(fields.chol_check_5yr.value, 10),
      bmi: parseFloat(fields.bmi.value),
      smoker: parseInt(fields.smoker.value, 10),
      stroke: parseInt(fields.stroke.value, 10),
      heart_disease_or_attack: parseInt(fields.heart_disease_or_attack.value, 10),
      phys_activity: parseInt(fields.phys_activity.value, 10),
      fruits_daily: parseInt(fields.fruits_daily.value, 10),
      veggies_daily: parseInt(fields.veggies_daily.value, 10),
      heavy_alcohol: parseInt(fields.heavy_alcohol.value, 10),
      has_healthcare: parseInt(fields.has_healthcare.value, 10),
      no_doc_because_cost: parseInt(fields.no_doc_because_cost.value, 10),
      general_health: parseInt(fields.general_health.value, 10),
      mental_health_days: parseInt(fields.mental_health_days.value, 10),
      physical_health_days: parseInt(fields.physical_health_days.value, 10),
      difficulty_walking: parseInt(fields.difficulty_walking.value, 10),
      sex: parseInt(fields.sex.value, 10),
      age_category: parseInt(fields.age_category.value, 10),
      education_level: parseInt(fields.education_level.value, 10),
      income_level: parseInt(fields.income_level.value, 10)
    };

    const apiUrl = window.location.origin.includes("5000")
      ? "/api/predict"
      : "http://127.0.0.1:5000/api/predict";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Prediction request failed.");
      }

      renderPredictionResult(data);
    } catch (err) {
      console.error("API Error:", err);
      alert("Backend connection error: Ensure 'python app.py' is running on port 5000.");
    } finally {
      btnPredict.disabled = false;
      btnPredict.textContent = "Assess Diabetes Risk";
    }
  });

  // 6. Render Results to UI
  function renderPredictionResult(data) {
    resultPlaceholder.style.display = "none";
    resultContent.style.display = "block";

    const tierClass = data.risk_tier.toLowerCase();

    // Risk Badge & Score
    resultRiskBadge.className = `result-tag ${tierClass}`;
    resultRiskBadge.textContent = `${data.risk_tier} RISK SUSCEPTIBILITY`;
    resultScore.textContent = `${data.risk_score_pct}%`;

    // Animated Bar Fill
    resultBarFill.className = `risk-bar-fill ${tierClass}`;
    resultBarFill.style.width = `${Math.min(Math.max(data.risk_score_pct, 5), 100)}%`;

    // Timestamp
    const now = new Date();
    resultTimestamp.textContent = `Assessed ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Summary Text
    resultSummaryText.textContent = data.summary;

    // Breakdown Grid
    if (data.factor_breakdown && data.factor_breakdown.length > 0) {
      resultBreakdownGrid.innerHTML = data.factor_breakdown
        .map((item) => {
          let badgeCls = "normal";
          if (item.impact === "Elevated") badgeCls = "elevated";
          if (item.impact === "High Risk") badgeCls = "high";
          return `
            <div class="breakdown-pill">
              <span class="breakdown-name">${item.factor}</span>
              <span class="breakdown-val ${badgeCls}">${item.impact}</span>
            </div>
          `;
        })
        .join("");
    }

    // Recommendations
    if (data.recommendations && data.recommendations.length > 0) {
      resultRecsList.innerHTML = data.recommendations
        .map((rec) => `<li>${rec}</li>`)
        .join("");
    }

    // Smooth scroll on mobile
    if (window.innerWidth < 950) {
      document.getElementById("resultCard").scrollIntoView({ behavior: "smooth" });
    }
}
