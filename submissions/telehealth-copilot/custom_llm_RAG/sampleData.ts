import { PatientRecord } from "./types";

export const sampleRecords: PatientRecord[] = [
  {
    id: "1",
    name: "John Doe",
    dob: "1965-07-12",
    history: `
    - **Chronic Conditions**: Hypertension (diagnosed 2018), Type 2 Diabetes (diagnosed 2020), Hyperlipidemia (2021).
    - **Medications**: Metformin (500mg daily), Lisinopril (10mg daily), Atorvastatin (20mg daily).
    - **Past Complications**: Experienced mild diabetic neuropathy in 2022, managed with glycemic control.
    - **Family History**: Father had a stroke at 62; mother diagnosed with Type 2 Diabetes at 55.
    - **Lifestyle Notes**: Follows a low-carb diet, walks 30 minutes daily, but struggles with consistency.
    - **Recent Tests**: A1C: 6.8% (January 2024), Cholesterol levels improved.
    - **Ongoing Concerns**: Considering a continuous glucose monitor (CGM) for better tracking.
    - **Upcoming Appointments**: Endocrinology review in May 2024.
    `,
    dateAdded: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    dob: "1978-04-25",
    history: `
    - **Surgical History**: Total knee replacement (left) in June 2023. ACL tear in 2019 (same knee).
    - **Current Therapy**: Physical therapy twice a week, 85% range of motion recovered.
    - **Medications**: Ibuprofen (as needed), Vitamin D supplements, occasional corticosteroid injections.
    - **Recent Concerns**: Occasional swelling in the knee after prolonged activity.
    - **Lifestyle Notes**: Active in yoga and swimming, avoids high-impact exercises.
    - **Future Considerations**: Possible PRP (platelet-rich plasma) therapy if swelling persists.
    `,
    dateAdded: "2024-02-01",
  },
  {
    id: "3",
    name: "Michael Johnson",
    dob: "1959-11-30",
    history: `
    - **Heart Condition**: Diagnosed with atrial fibrillation (AFib) in 2021.
    - **Medications**: Warfarin (2mg daily), Beta-blockers, Aspirin (81mg daily).
    - **Past Hospitalization**: Admitted in 2022 for minor stroke, recovered fully.
    - **Family History**: Mother had congestive heart failure at 70.
    - **Lifestyle Notes**: Mediterranean diet, mindful breathing exercises.
    - **Ongoing Concerns**: Needs frequent INR testing, considering NOACs.
    `,
    dateAdded: "2024-02-10",
  },
  {
    id: "4",
    name: "Emily White",
    dob: "1992-03-18",
    history: `
    - **Respiratory Issues**: Asthma since childhood, uses albuterol inhaler as needed.
    - **Allergies**: Allergic to penicillin, peanuts, and cat dander.
    - **Recent Episodes**: Mild asthma attack in December 2023 due to cold weather.
    - **Lifestyle Notes**: Swimmer, avoids dusty environments, follows an anti-inflammatory diet.
    - **Ongoing Care**: Considering allergy immunotherapy.
    `,
    dateAdded: "2024-02-15",
  },
  {
    id: "5",
    name: "Carlos Ramirez",
    dob: "1974-06-02",
    history: `
    - **Chronic Pain**: Herniated disc (since 2015), chronic lower back pain.
    - **Medications**: Gabapentin (300mg twice daily), occasional NSAIDs.
    - **Past Treatments**: Physical therapy, epidural steroid injection in 2021.
    - **Lifestyle Notes**: Tai chi, light stretching, avoids heavy lifting.
    - **Future Considerations**: Exploring acupuncture, minimally invasive surgery.
    `,
    dateAdded: "2024-02-20",
  },
  {
    id: "6",
    name: "Sophia Lee",
    dob: "1985-09-14",
    history: `
    - **Endocrine Disorder**: Diagnosed with hypothyroidism in 2017.
    - **Medications**: Levothyroxine (75mcg daily).
    - **Recent Tests**: TSH levels stable (January 2024).
    - **Family History**: Mother and grandmother had thyroid disorders.
    - **Lifestyle Notes**: Gluten-free diet as recommended by endocrinologist.
    - **Ongoing Concerns**: Fatigue, checking for vitamin D deficiency.
    `,
    dateAdded: "2024-02-25",
  },
  {
    id: "7",
    name: "David Foster",
    dob: "1968-12-08",
    history: `
    - **Neurological Condition**: Mild Parkinson’s Disease (diagnosed 2022).
    - **Medications**: Carbidopa-Levodopa (25/100mg three times daily).
    - **Symptoms**: Mild hand tremor, occasional rigidity.
    - **Lifestyle Notes**: Strength training, cognitive exercises.
    - **Ongoing Monitoring**: Neurologist evaluating medication adjustments.
    `,
    dateAdded: "2024-03-01",
  },
  {
    id: "8",
    name: "Aisha Khan",
    dob: "1990-01-22",
    history: `
    - **Autoimmune Disease**: Lupus (SLE) diagnosed in 2019.
    - **Medications**: Hydroxychloroquine (200mg daily), corticosteroids (for flare-ups).
    - **Recent Flare-Ups**: Joint pain, fatigue in December 2023.
    - **Lifestyle Notes**: Yoga, avoids prolonged sun exposure.
    - **Ongoing Care**: Evaluating immunosuppressive therapy options.
    `,
    dateAdded: "2024-03-05",
  },
  {
    id: "9",
    name: "Ethan Carter",
    dob: "1982-05-29",
    history: `
    - **Mental Health**: Diagnosed with generalized anxiety disorder in 2015.
    - **Medications**: Sertraline (50mg daily), occasional lorazepam for acute episodes.
    - **Therapy**: Weekly CBT sessions.
    - **Lifestyle Notes**: Meditation, regular exercise, avoids caffeine.
    - **Ongoing Concerns**: Stress management during work deadlines.
    `,
    dateAdded: "2024-03-10",
  },
  {
    id: "10",
    name: "Linda Martinez",
    dob: "1971-10-05",
    history: `
    - **Oncology History**: Breast cancer survivor (diagnosed 2018, remission 2021).
    - **Past Treatments**: Chemotherapy, lumpectomy, radiation.
    - **Medications**: Tamoxifen (20mg daily).
    - **Ongoing Monitoring**: Annual mammograms, oncologist follow-ups.
    - **Lifestyle Notes**: Plant-based diet, strength training.
    - **Recent Concerns**: Mild lymphedema in left arm.
    `,
    dateAdded: "2024-03-15",
  },
];
