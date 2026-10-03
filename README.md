
# 🩺 GlucoScan — AI-Based Diabetes Risk Prediction System

> **Machine Learning for Early Diabetes Risk Prediction**

GlucoScan is an AI/ML-based diabetes risk prediction system that analyses health, lifestyle, and socioeconomic parameters to provide a **preliminary, non-diagnostic diabetes risk estimate**.

---

## 📌 Project Overview

Early identification of diabetes risk can help people seek appropriate medical advice sooner. GlucoScan uses patterns in healthcare data to estimate whether a person's profile falls into a **low-risk or high-risk category**.

The current implementation uses a **Random Forest Classifier** trained on 21 health and demographic features. Because the dataset contains substantially more non-diabetic records than diabetic records, the final model uses `class_weight="balanced"` to give greater importance to the minority diabetic class.

The project is intended for **educational, research, and preliminary screening purposes only**. It is **not a medical diagnostic tool**.

---

## 🎯 Objectives

- Develop an ML-based system for diabetes-risk prediction.
- Analyse health and lifestyle parameters to identify predictive patterns.
- Train and evaluate classical machine-learning models.
- Address class imbalance in healthcare data.
- Produce a simple and understandable prediction output.
- Demonstrate practical applications of AI/ML in healthcare.

---

## ✨ Key Features

- 🧠 Random Forest-based diabetes prediction.
- ⚖️ Balanced class weighting for imbalanced medical data.
- 📊 21 health, lifestyle, demographic, and socioeconomic inputs.
- 📈 Probability-based risk estimation.
- 💻 Simple interactive Python prediction interface.
- 🔄 Continuous prediction loop for multiple patient profiles.
- 🛡️ Non-diagnostic output intended for education and research.

---

## 📊 Dataset

The project uses a public healthcare dataset containing **253,680 records** and **21 input features**.

### Dataset Distribution

| Class | Records |
|---|---:|
| Non-diabetic (`0`) | 218,334 |
| Diabetic (`1`) | 35,346 |
| **Total** | **253,680** |

The dataset is therefore imbalanced, with the non-diabetic class representing the majority of observations.

### Input Features

The model uses the following 21 features:

1. High Blood Pressure
2. High Cholesterol
3. Cholesterol Check in the Last 5 Years
4. BMI
5. Smoker
6. Stroke History
7. Heart Disease or Attack History
8. Physical Activity
9. Daily Fruit Consumption
10. Daily Vegetable Consumption
11. Heavy Alcohol Consumption
12. Healthcare Coverage
13. Avoided Doctor Because of Cost
14. General Health
15. Mental Health Days
16. Physical Health Days
17. Difficulty Walking or Climbing
18. Sex
19. Age Category
20. Education Level
21. Income Level

The target column is:

```text
diabetes
```

where:

```text
0 = Lower-risk / non-diabetic class
1 = Diabetic class
```

---

## 🤖 Machine Learning Model

### Random Forest Classifier

The current backend uses:

```python
RandomForestClassifier(
    n_estimators=50,
    max_depth=10,
    random_state=42,
    class_weight="balanced"
)
```

The model is trained using all 21 input features.

The `class_weight="balanced"` setting is used to compensate for the class imbalance by assigning greater weight to the minority class during training.

The implementation trains the model and caches it so that repeated predictions do not require retraining during the same program session.

---

## 🔄 System Workflow

```text
              ┌──────────────────────┐
              │   Public Dataset     │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Data Preprocessing   │
              │ & Feature Handling   │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Random Forest Model  │
              │ class_weight=balanced│
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Patient Input        │
              │ 21 Health Parameters │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Prediction Probability│
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Risk Classification  │
              │ LOW / HIGH RISK      │
              └──────────────────────┘
```

---

## 🧮 Prediction Logic

The model generates a probability for the positive class:

```python
risk_prob = rf_model_full.predict_proba(input_data)[0][1]
```

The current backend uses a threshold of `0.5`:

```text
Probability > 0.5  →  HIGH RISK
Probability ≤ 0.5  →  LOW RISK
```

The system also displays the estimated probability as a percentage.

---

## 🖥️ Current Implementation

The supplied backend is a Python-based interactive predictor.

It asks the user to enter patient information such as:

```text
High Blood Pressure
High Cholesterol
Cholesterol Check
BMI
Smoking Status
Stroke History
Heart Disease History
Physical Activity
Fruit Consumption
Vegetable Consumption
Alcohol Consumption
Healthcare Coverage
Doctor Avoidance Due to Cost
General Health
Mental Health Days
Physical Health Days
Difficulty Walking
Sex
Age Category
Education Level
Income Level
```

The program then processes the inputs and displays a prediction.

Example output:

```text
========================================
         PREDICTION RESULT
========================================
⚠️ HIGH RISK (Probability: 72.4%)
========================================
```

The backend also supports pressing **Enter** to use predefined default values and entering `q` to exit.

---

## 📁 Project Structure

A recommended repository structure is:

```text
GlucoScan/
│
├── backend.py
├── final_dataset (1).csv
├── 01_Diabetes_EDA.ipynb
├── README.md
│
└── presentation/
    └── AI based diabetes detector system.pptx
```

### File Description

| File | Purpose |
|---|---|
| `backend.py` | Trains the Random Forest model and performs predictions |
| `final_dataset (1).csv` | Healthcare dataset used for model training |
| `01_Diabetes_EDA.ipynb` | Exploratory Data Analysis notebook |
| `README.md` | Project documentation |
| `presentation/` | Project presentation materials |

---

## ⚙️ Requirements

### Hardware

- Laptop or desktop computer
- Minimum **4 GB RAM**
- **8 GB RAM recommended**
- Internet connection for obtaining datasets and documentation

### Software

- Python 3.x
- VS Code, Jupyter Notebook, or Google Colab
- Pandas
- Scikit-learn
- NumPy
- Matplotlib

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd GlucoScan
```

### 2. Install required libraries

```bash
pip install pandas scikit-learn numpy matplotlib
```

### 3. Keep the dataset in the project directory

Make sure the CSV file is available where the backend expects it:

```text
final_dataset (1).csv
```

### 4. Run the predictor

```bash
python backend.py
```

---

## ▶️ How to Use

After running the program:

1. Enter the requested health information.
2. Use `0` or `1` where the program specifies binary inputs.
3. Enter numerical values for BMI, health-day counts, age category, education, and income.
4. Press **Enter** to use the displayed default value.
5. The system calculates the prediction probability.
6. The system displays either **LOW RISK** or **HIGH RISK**.
7. Enter `q` when prompted to exit.

---

## 📈 Project Results

The project presentation reports the following evaluation figures for the developed system:

| Metric | Reported Value |
|---|---:|
| Cleaned records | **229,474** |
| Clinical Recall / Sensitivity | **79.47%** |
| Test ROC-AUC | **0.8187** |

These values are reported project results and should be interpreted in the context of the dataset, preprocessing pipeline, test split, and evaluation methodology used during the project.

---

## ⚖️ Handling Class Imbalance

One of the main challenges identified during development was the difference between the two classes.

The dataset contains approximately:

```text
218,334 → Non-diabetic
35,346  → Diabetic
```

A model trained without addressing this imbalance can become biased toward the majority class.

To address this, the final proposed model uses:

```python
class_weight="balanced"
```

This increases the relative importance of the minority class during model training and is intended to improve the model's ability to identify diabetic/high-risk cases.

---

## 🔬 Model Development

The project development follows these major stages:

### Phase 1 — Literature Review & Dataset Selection

- Study diabetes prediction approaches.
- Identify a suitable public healthcare dataset.
- Understand the available attributes.

### Phase 2 — Data Preprocessing & EDA

- Inspect the dataset.
- Clean and organise the data.
- Analyse feature distributions.
- Study relationships between features and the target.

### Phase 3 — Model Development

- Implement classical ML models.
- Study Random Forest classification.
- Train the model using the available features.
- Address class imbalance.

### Phase 4 — Testing & Evaluation

- Test the trained model.
- Analyse classification performance.
- Evaluate recall and ROC-AUC.
- Refine the prediction approach.

### Phase 5 — Interface & Documentation

- Develop a simple prediction interface.
- Integrate model prediction.
- Document the system.
- Prepare the final demonstration.

---

## 🌐 Future Scope

The project can be extended with:

- Streamlit-based web interface.
- Graphical presentation of prediction results.
- Additional model comparison.
- Hyperparameter tuning.
- Cross-validation.
- Feature-importance visualisation.
- Improved input validation.
- Model persistence using a saved model file.
- Deployment as an educational web application.
- More extensive testing on external datasets.

---


**GlucoScan is an educational and research project.**

The output is a **preliminary risk estimate and not a medical diagnosis**. Users should consult a qualified healthcare professional for medical evaluation, diagnosis, treatment, or interpretation of health information.

---

## 👥 Project Team

| Member | Contribution |
|---|---|
| Aarjav Jain | Dataset research & collection |
| Samarth Khare | Data preprocessing |
| Aryan Srivastava | Machine-learning model |
| Aryan Srivastava | Model testing & evaluation |
| Ishan Bharti | User interface |
| Shubhankar Sharma | Documentation & presentation |

> Update the team table if the final team-member list or responsibilities differ from the latest project allocation.

---

## 📚 References & Resources

- Public healthcare / diabetes dataset used for the project
- Kaggle — public datasets and dataset resources
- Scikit-learn Documentation — machine-learning algorithms and evaluation
- Python Documentation — Python language and standard library
- Pandas Documentation — data loading and tabular data processing
- Matplotlib Documentation — data visualisation
- Streamlit Documentation — interactive Python web applications
- Relevant research papers on machine learning and diabetes-risk prediction

---

## 🚀 Project Status

```text
Dataset                ████████████████████  Complete
EDA                    ████████████████████  Complete
ML Model               ████████████████████  Implemented
Class Balancing        ████████████████████  Implemented
Prediction Backend     ████████████████████  Implemented
Evaluation             ████████████████████  Completed
Web UI                  ███████████░░░░░░░░░  Extension
Deployment              █████░░░░░░░░░░░░░░░  Future
```

---

## ⭐ Conclusion

GlucoScan demonstrates how classical machine-learning techniques can be applied to healthcare data for preliminary diabetes-risk assessment. The project combines data analysis, feature-based prediction, Random Forest classification, and class-imbalance handling into a practical AI/ML workflow.

The main goal is to demonstrate the **application of machine learning for early risk identification and healthcare research**, while keeping the system simple, interpretable, and suitable for educational use.

---
