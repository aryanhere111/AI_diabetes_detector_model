import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import warnings
warnings.filterwarnings('ignore')

# 1. CACHE & TRAIN THE BALANCED MODEL
if 'rf_model_full' not in globals():
    print("Training BALANCED model on ALL features... (Takes ~10 seconds)")
    try:
        # Try loading the new dataset name, fallback to the original if it fails
        df = pd.read_csv('final_dataset (1)_2.csv')
    except FileNotFoundError:
        df = pd.read_csv('final_dataset (1).csv')

    X = df.drop('diabetes', axis=1)
    y = df['diabetes']

    # class_weight='balanced' is the magic fix for imbalanced medical data!
    rf_model_full = RandomForestClassifier(n_estimators=50, max_depth=10,
                                           random_state=42, class_weight='balanced')
    rf_model_full.fit(X, y)
    print("✅ Balanced 21-feature model trained and cached!\n")
else:
    print("⚡ Using cached balanced model\n")

def get_input(prompt, default):
    """Helper function to allow pressing 'Enter' to use a default value"""
    val = input(f"{prompt} [Default: {default}]: ")
    if val.strip() == '':
        return default
    return float(val)

# 2. CONTINUOUS LOOP
while True:
    print("-" * 55)
    print("Enter patient details (Press ENTER to use healthy defaults, type 'q' to quit):")

    val = input("1. High Blood Pressure (0=No, 1=Yes) [or 'q' to quit]: ")
    if val.lower() == 'q':
        print("Exiting predictor.")
        break

    try:
        # Default healthy baseline values
        high_bp = float(val) if val.strip() != '' else 0.0
        high_chol = get_input("2. High Cholesterol (0=No, 1=Yes)", 0.0)
        chol_check = get_input("3. Cholesterol Check in 5 yrs (0=No, 1=Yes)", 1.0)
        bmi = get_input("4. BMI (e.g., 25.0)", 25.0)
        smoker = get_input("5. Smoker (100+ cigarettes in life) (0=No, 1=Yes)", 0.0)
        stroke = get_input("6. Stroke history (0=No, 1=Yes)", 0.0)
        heart_disease = get_input("7. Heart disease/attack history (0=No, 1=Yes)", 0.0)
        phys_activity = get_input("8. Physical Activity in past 30 days (0=No, 1=Yes)", 1.0)
        fruits = get_input("9. Consume fruits daily (0=No, 1=Yes)", 1.0)
        veggies = get_input("10. Consume veggies daily (0=No, 1=Yes)", 1.0)
        heavy_alcohol = get_input("11. Heavy Alcohol consumer (0=No, 1=Yes)", 0.0)
        healthcare = get_input("12. Has Healthcare coverage (0=No, 1=Yes)", 1.0)
        no_doc_cost = get_input("13. Avoided doctor due to cost (0=No, 1=Yes)", 0.0)
        gen_hlth = get_input("14. General Health (1=Excellent to 5=Poor)", 2.0)
        ment_hlth = get_input("15. Days of poor mental health (0-30)", 0.0)
        phys_hlth = get_input("16. Days of poor physical health (0-30)", 0.0)
        diff_walk = get_input("17. Difficulty walking/climbing (0=No, 1=Yes)", 0.0)
        sex = get_input("18. Sex (0=Female, 1=Male)", 0.0)
        age = get_input("19. Age Category (1=18-24, 7=45-49, 13=80+)", 5.0)
        education = get_input("20. Education Level (1=No school, 6=College Grad)", 5.0)
        income = get_input("21. Income Level (1=<$10k, 8=>=$75k)", 6.0)

        # Must map inputs in the exact column order of the DataFrame
        input_data = [[
            high_bp, high_chol, chol_check, bmi, smoker, stroke, heart_disease,
            phys_activity, fruits, veggies, heavy_alcohol, healthcare, no_doc_cost,
            gen_hlth, ment_hlth, phys_hlth, diff_walk, sex, age, education, income
        ]]

        # Extract prediction probability
        risk_prob = rf_model_full.predict_proba(input_data)[0][1]

        # Output Results
        print("\n" + "="*40)
        print("         PREDICTION RESULT")
        print("="*40)
        if risk_prob > 0.5:
            print(f"⚠️  HIGH RISK (Probability: {risk_prob:.1%})")
        else:
            print(f"✅  LOW RISK (Probability: {risk_prob:.1%})")
        print("="*40 + "\n")

    except ValueError:
        print("\n❌ Invalid input. Let's start this patient profile over.\n")
