function createRestorationsSection(title) {
  return {
    id: "restorations",
    title,
    included: true,
    rows: [
      { type: "choice", label: "Resto type", valuePrefix: "", selected: 1, required: true, options: ["GIC Resto", "CR Resto"], modeValues: ["gic", "cr"], deletable: false },
      { type: "tooth_surface_picker", label: "Tooth and surfaces", valuePrefix: "Teeth: ", entries: [] },
      { type: "choice", label: "Reason for resto", valuePrefix: "Reason for resto: ", selected: 0, options: ["Caries", "Defective Restoration", "Lost Restoration", "Chipped tooth", "Aesthetics", "Sensitivity", "TBA", "TBA lesion"] },
      {
        type: "choice",
        label: "LA",
        valuePrefix: "",
        selected: 0,
        options: [
          "No LA",
          "10% topical Xylocaine, 2.2mL",
          "10% topical Xylocaine, 4.4mL",
          "No topical",
          "no topical, 2.2mL",
          "2.2mL",
          "1:80k adr lidocaine via IDB",
          "1:100k adr articaine via infils",
          "1:80k adr lidocaine via IDB, 2.2mL 1:100k adr articaine via infils",
          "1:80k adr lidocaine via infils",
          "Other"
        ]
      },
      { type: "line", text: "Caries freed and cavity prepped" },
      { type: "line", text: "10% Polyacrylic Acid Dentine Conditioner applied", showWhen: "gic" },
      { type: "line", text: "37% Phosphoric Acid Etch applied", showWhen: "cr" },
      { type: "choice", label: "GIC material", valuePrefix: "", selected: 0, showWhen: "gic", options: ["Riva LC placed and set"] },
      { type: "choice", label: "Bond", valuePrefix: "", selected: 0, showWhen: "cr", options: ["Scotchbond applied, dried and cured", "G-premio bond applied, dried and cured", "clearfil se2 applied, dried and cured"] },
      { type: "text", label: "Composite material", value: "", placeholder: "Enter material", suffix: "placed and cured", showWhen: "cr" },
      { type: "choice", label: "Finish", valuePrefix: "", selected: 0, options: ["Restoration polished and bite checked", "Restoration polished", "Restorations polished and bite checked"] }
    ]
  };
}

const BWS_TAKEN_OPTION = "Taken for inter-proximal caries assessment and bone levels";

function createRadiographRows() {
  return [
    {
      type: "choice",
      label: "BWs",
      valuePrefix: "BWs: ",
      selected: 0,
      options: [
        "Not indicated today",
        BWS_TAKEN_OPTION,
        "Pt declined bitewings - understands exam not complete without x-rays"
      ]
    },
    {
      type: "choice",
      label: "Caries",
      valuePrefix: "Caries: ",
      selected: -1,
      options: ["as above", "nil"],
      showIf: { label: "BWs", equals: BWS_TAKEN_OPTION },
      linkedTo: "BWs"
    },
    {
      type: "tooth_picker",
      label: "Endodontically treated teeth",
      valuePrefix: "Endodontically treated teeth: ",
      selectedMode: "nil",
      entries: [],
      showIf: { label: "BWs", equals: BWS_TAKEN_OPTION },
      linkedTo: "BWs"
    },
    {
      type: "choice_text",
      label: "Bone levels",
      valuePrefix: "Bone levels: ",
      selected: -1,
      options: ["Normal", "Generalised HBL, approx 2mm", "Generalised HBL, approx 4mm", "Generalised HBL, approx 6mm", "WNL", "Other"],
      customOptionIndex: 5,
      customValue: "",
      customPlaceholder: "Enter bone level finding",
      showIf: { label: "BWs", equals: BWS_TAKEN_OPTION },
      linkedTo: "BWs"
    },
    {
      type: "choice_text",
      label: "Other Findings from BWs",
      valuePrefix: "Other Findings from BWs: ",
      selected: -1,
      options: ["Nil", "Other"],
      customOptionIndex: 1,
      customValue: "",
      customPlaceholder: "Enter finding",
      showIf: { label: "BWs", equals: BWS_TAKEN_OPTION },
      linkedTo: "BWs"
    },
    {
      type: "choice",
      label: "PAs",
      valuePrefix: "PAs: ",
      selected: 0,
      options: ["None indicated", "Taken to assess for PAP, bone levels, caries and root morphology"]
    }
  ];
}

function createRestorationTemplateSections() {
  return [
    {
      id: "restoration",
      title: "Restoration",
      included: true,
      rows: [
        { type: "line", text: "Med Hx sheet scanned." },
        {
          type: "choice_text",
          label: "Sig Med hx",
          valuePrefix: "Sig Med hx: ",
          selected: 0,
          options: ["No changes in Med Hx", "No significant med hx for resto", "Significant (enter details)"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter significant med hx",
          customRequired: true,
          customRequiredMessage: "Please enter significant medical history details.",
          deletable: false
        },
        { type: "choice", label: "Reason for attendance", valuePrefix: "Reason for attendance: ", selected: 0, options: ["Emergency appt", "Chipped tooth", "Restoration", "Continue tx plan", "Lost restoration"] },
        { type: "choice_text", label: "C/O", valuePrefix: "C/O: ", selected: 0, options: ["Nil", "Pain", "Sensitivity", "Chipped tooth", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter complaint" },
        { type: "line", text: "Pain details:", showIf: { label: "C/O", equals: "Pain" } },
        { type: "tooth_picker", label: "Site", valuePrefix: "Site: ", selectedMode: "nil", entries: [], showIf: { label: "C/O", equals: "Pain" } },
        { type: "tooth_picker", label: "Sensitivity site", valuePrefix: "Sensitivity site: ", selectedMode: "nil", entries: [], showIf: { label: "C/O", equals: "Sensitivity" } },
        { type: "choice_text", label: "Onset", valuePrefix: "Onset: ", selected: -1, options: ["Today", "Several days ago", "Over a week ago", "Months ago", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter onset detail", showIf: { label: "C/O", equals: "Pain" } },
        { type: "choice_text", label: "Character", valuePrefix: "Character: ", selected: -1, options: ["Sharp", "Aching", "Throbbing", "Burning", "Itching", "Other"], customOptionIndex: 5, customValue: "", customPlaceholder: "Enter character detail", showIf: { label: "C/O", equals: "Pain" } },
        { type: "choice_text", label: "Radiation", valuePrefix: "Radiation: ", selected: -1, options: ["Nil", "Head", "Neck", "Jaw", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter radiation detail", showIf: { label: "C/O", equals: "Pain" } },
        { type: "choice_text", label: "Duration", valuePrefix: "Duration: ", selected: -1, options: ["Seconds", "Minutes", "Hours", "Constant", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter duration detail", showIf: { label: "C/O", equals: "Pain" } },
        { type: "choice", label: "Severity", valuePrefix: "Severity: ", selected: -1, options: ["1/10", "2/10", "3/10", "4/10", "5/10", "6/10", "7/10", "8/10", "9/10", "10/10"], showIf: { label: "C/O", equals: "Pain" } },
        { type: "line", text: "OE:" },
        { type: "choice_text", label: "OE detail", valuePrefix: "", selected: 0, options: ["Caries as previously noted", "26 OP lost restoration", "Other"], customOptionIndex: 2, customValue: "", customPlaceholder: "Enter OE finding" },
        { type: "choice_text", label: "Dx", valuePrefix: "Dx: ", selected: 0, options: ["Caries", "Reversible Pulpitis", "Enamel fracture", "Lost restoration", "Lost restoration w/caries", "Aesthetic concern", "Other"], customOptionIndex: 6, customValue: "", customPlaceholder: "Enter diagnosis" }
      ]
    },
    {
      id: "radiographs",
      title: "Radiographs",
      included: true,
      rows: createRadiographRows()
    },
    createRestorationsSection("Restorations"),
    { id: "discussion", title: "Discussion", included: true, rows: [{ type: "line", text: "Pt advised to avoid biting hard foods on tooth" }, { type: "line", text: "Patient advised tooth may need RCT+/- crown if symptoms don't subside or arise and understands." }] },
    { id: "next-visit", title: "Next Visit", included: true, rows: [{ type: "choice", label: "Timing", valuePrefix: "", selected: 0, options: ["6 monthly clean 20mins", "recall for initial clean", "review 15mins", "review 30mins"] }, { type: "choice", label: "Item codes", valuePrefix: "", selected: 0, options: ["013, 532", "013, 022, 532", "013, 5"] }] }
  ];
}

function createNewPatientTemplateSections() {
  return [
    {
      id: "npe-attendance",
      title: "New Patient Exam",
      included: true,
      rows: [
        { type: "choice_text", label: "Reason for attendance", valuePrefix: "Reason for attendance: ", selected: 0, options: ["Routine checkup", "Specific concern", "Other"], customOptionIndex: 2, customValue: "", customPlaceholder: "Enter reason" },
        { type: "choice_text", label: "C/O", valuePrefix: "C/O: ", selected: 0, options: ["Nil", "Pain", "Sensitivity", "Other"], customOptionIndex: 3, customValue: "", customPlaceholder: "Enter complaint" },
        { type: "line", text: "Pain details:", showIf: { label: "C/O", equals: "Pain" } },
        { type: "tooth_picker", label: "Site", valuePrefix: "Site: ", selectedMode: "nil", entries: [], showIf: { label: "C/O", equals: "Pain" } },
        { type: "tooth_picker", label: "Sensitivity site", valuePrefix: "Sensitivity site: ", selectedMode: "nil", entries: [], showIf: { label: "C/O", equals: "Sensitivity" } },
        { type: "choice_text", label: "Onset", valuePrefix: "Onset: ", selected: -1, options: ["Today", "Several days ago", "Over a week ago", "Months ago", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter onset detail", showIf: { label: "C/O", equals: "Pain" } },
        { type: "choice_text", label: "Character", valuePrefix: "Character: ", selected: -1, options: ["Sharp", "Aching", "Throbbing", "Burning", "Itching", "Other"], customOptionIndex: 5, customValue: "", customPlaceholder: "Enter character detail", showIf: { label: "C/O", equals: "Pain" } },
        { type: "choice_text", label: "Radiation", valuePrefix: "Radiation: ", selected: -1, options: ["Nil", "Head", "Neck", "Jaw", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter radiation detail", showIf: { label: "C/O", equals: "Pain" } },
        { type: "choice_text", label: "Duration", valuePrefix: "Duration: ", selected: -1, options: ["Seconds", "Minutes", "Hours", "Constant", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter duration detail", showIf: { label: "C/O", equals: "Pain" } },
        { type: "choice", label: "Severity", valuePrefix: "Severity: ", selected: -1, options: ["1/10", "2/10", "3/10", "4/10", "5/10", "6/10", "7/10", "8/10", "9/10", "10/10"], showIf: { label: "C/O", equals: "Pain" } }
      ]
    },
    {
      id: "medical-history",
      title: "Medical History",
      included: true,
      rows: [
        { type: "line", text: "Form filled and signed - See scanned sheet" },
        { type: "choice_text", label: "Allergies", valuePrefix: "Allergies: ", selected: 0, options: ["No relevant allergies", "Allergic to penicillin", "Other"], customOptionIndex: 2, customValue: "", customPlaceholder: "Enter allergies" },
        { type: "choice_text", label: "Medication", valuePrefix: "Medication: ", selected: 0, options: ["No relevant medication", "Other"], customOptionIndex: 1, customValue: "", customPlaceholder: "Enter medications" },
        { type: "choice_text", label: "Conditions", valuePrefix: "Conditions: ", selected: 0, options: ["No relevant conditions", "Other"], customOptionIndex: 1, customValue: "", customPlaceholder: "Enter medical conditions" },
        {
          type: "multi_choice",
          label: "Major implications",
          valuePrefix: "Major implications: ",
          selected: [],
          bold: true,
          showIf: { label: "Conditions", notEquals: "No relevant conditions" },
          options: [
            "Diabetes",
            "Risk of Infective Endocarditis",
            "Risk of MRONJ",
            "Head/neck radiation hx",
            "Risk of bleeding",
            "Immunocompromised"
          ]
        }
      ]
    },
    {
      id: "social-dental-history",
      title: "Social and Dental History",
      included: true,
      rows: [
        { type: "choice", label: "Anxious of dental visits", valuePrefix: "Anxious of dental visits: ", selected: -1, options: ["Yes", "No"] },
        { type: "choice_text", label: "Smoking", valuePrefix: "Smoking: ", selected: -1, options: ["Never", "Nil", "Ex smoker", "Daily smoker", "Occasional smoker", "Using Vape", "N/A", "Other"], customOptionIndex: 7, customValue: "", customPlaceholder: "Enter smoking detail" },
        { type: "choice", label: "Last check up", valuePrefix: "Last check up: ", selected: -1, options: ["3m", "6m", "9m", "12m", "18m", "24m", ">2yrs", ">5yrs", ">10yrs", "Never"] },
        { type: "choice", label: "Brushing", valuePrefix: "Brushing: ", selected: -1, options: ["Once", "Twice", ">2 times"] },
        {
          type: "choice_text",
          label: "Interdental cleaning type",
          valuePrefix: "Interdental cleaning: ",
          selected: -1,
          options: ["Floss", "Piksters", "Waterpik", "Nil", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter interdental cleaning type"
        },
        {
          type: "choice_text",
          label: "Interdental cleaning frequency",
          valuePrefix: "Interdental cleaning frequency: ",
          selected: -1,
          options: ["Daily", "More than once daily", "Occasionally", "a few times a week", "once a week", "Other"],
          customOptionIndex: 5,
          customValue: "",
          customPlaceholder: "Enter interdental cleaning frequency",
          showIf: { label: "Interdental cleaning type", notEquals: "Nil" }
        }
      ]
    },
    {
      id: "soft-tissue-exam",
      title: "Soft Tissue Exam",
      included: true,
      rows: [
        { type: "choice_text", label: "LN, MOM, SG, TMJ", valuePrefix: "LN, MOM, SG, TMJ: ", selected: 0, options: ["Nil", "Other"], customOptionIndex: 1, customValue: "", customPlaceholder: "Enter findings" },
        { type: "choice_text", label: "Soft tissues", valuePrefix: "Soft tissues: ", selected: 0, options: ["Nil", "Other"], customOptionIndex: 1, customValue: "", customPlaceholder: "Enter soft tissue findings" }
      ]
    },
    {
      id: "dental-exam",
      title: "Dental Exam",
      included: true,
      rows: [
        { type: "choice_text", label: "PSR", valuePrefix: "PSR: ", selected: -1, options: ["000000", "000020", "111121", "212222", "222222", "333333", "323222", "111111", "Other"], customOptionIndex: 8, customValue: "", customPlaceholder: "Enter PSR" },
        { type: "choice_text", label: "Gingivae", valuePrefix: "Gingivae: ", selected: -1, options: ["Healthy", "Generalised inflammation", "Localised inflammation", "Other"], customOptionIndex: 3, customValue: "", customPlaceholder: "Enter gingival finding" },
        { type: "choice", label: "Plaque deposits", valuePrefix: "Plaque deposits: ", selected: -1, options: ["Nil", "Mild", "Moderate", "Severe"] },
        { type: "choice_text", label: "Plaque Location", valuePrefix: "Plaque location: ", selected: -1, options: ["Nil", "Generalised", "Lower Anteriors", "Posterior Uppers", "Posterior Lowers", "Posteriors", "Gumline", "Linguals/Palatals", "Generalised staining", "Other"], customOptionIndex: 9, customValue: "", customPlaceholder: "Enter plaque location" },
        { type: "choice", label: "Calculus deposits", valuePrefix: "Calculus deposits: ", selected: -1, options: ["Nil", "Mild", "Moderate", "Severe"] },
        { type: "choice_text", label: "Calculus Location", valuePrefix: "Calculus location: ", selected: -1, options: ["Nil", "Generalised", "Lower Anteriors", "Posterior Uppers", "Posterior Lowers", "Posteriors", "Other"], customOptionIndex: 6, customValue: "", customPlaceholder: "Enter calculus location" },
        { type: "choice", label: "Oral Hygiene", valuePrefix: "Oral hygiene: ", selected: -1, options: ["Poor", "Fair", "Good", "Excellent"] },
        { type: "line", text: "Teeth charted." },
        { type: "tooth_picker", label: "Caries", valuePrefix: "Caries: ", selectedMode: "nil", entries: [], nilOptionLabel: "Nil", selectOptionLabel: "Select teeth" },
        { type: "tooth_picker", label: "Leaking or defective restorations", valuePrefix: "Leaking or defective restorations: ", selectedMode: "nil", entries: [] },
        { type: "choice_text", label: "NCTL", valuePrefix: "NCTL: ", selected: -1, options: ["Nil", "Attrition", "Erosion", "Abrasion", "Abfraction", "TBA", "Generalised wear", "Other"], customOptionIndex: 7, customValue: "", customPlaceholder: "Enter NCTL detail" },
        { type: "choice_text", label: "Crowding", valuePrefix: "Crowding: ", selected: -1, options: ["Nil", "Mild", "Moderate", "Severe", "Upper", "Lower", "Upper and Lower", "Upper and Lower spacing", "Other"], customOptionIndex: 8, customValue: "", customPlaceholder: "Enter crowding detail" },
        { type: "choice_text", label: "Recession", valuePrefix: "Recession: ", selected: -1, options: ["Nil", "Generalised", "Localised", "Other"], customOptionIndex: 3, customValue: "", customPlaceholder: "Enter recession detail" },
        { type: "choice", label: "Prostheses", valuePrefix: "Prostheses: ", selected: -1, options: ["Nil", "Yes", "Nil - pt does not want dentures"] },
        { type: "tooth_picker", label: "Mobility", valuePrefix: "Mobility: ", selectedMode: "nil", entries: [] }
      ]
    },
    {
      id: "radiographs",
      title: "Radiographs",
      included: true,
      rows: createRadiographRows()
    },
    {
      id: "opg",
      title: "OPG",
      included: true,
      rows: [
        { type: "choice_text", label: "Indication for OPG", valuePrefix: "Indication for OPG: ", selected: -1, options: ["General Screening", "Patient Request", "Periodontal Screening", "Wisdom teeth", "Pain Assessment", "Treatment planning", "Other"], customOptionIndex: 6, customValue: "", customPlaceholder: "Enter indication" },
        { type: "tooth_picker", label: "Caries", valuePrefix: "Caries: ", selectedMode: "nil", entries: [] },
        { type: "choice_text", label: "Bone Level", valuePrefix: "Bone Level: ", selected: -1, options: ["Healthy", "Mild", "Moderate", "Severe", "Mild Bone Loss", "Mild to moderate bone loss, localised bone loss", "WNL", "Other"], customOptionIndex: 7, customValue: "", customPlaceholder: "Enter bone level detail" },
        { type: "choice_text", label: "Other Findings", valuePrefix: "Other Findings: ", selected: 0, options: ["Nil", "Wisdoms - lowers horizontally impacted, advised monitoring for symptoms or damage to 7s, otherwise leaving them", "Wisdoms - lowers mesially impacted, advised high risk of perio/caries - advised extraction", "Wisdoms - lowers soft tissue impaction, advised good OH, exo if caries/perio detected or symptoms keep bothering pt and he prefers exo", "Wisdoms - all 4 impacted and unerupted, advised monitoring for symptoms or damage to 7s, otherwise leaving them", "Other"], customOptionIndex: 5, customValue: "", customPlaceholder: "Enter OPG findings" }
      ]
    },
    {
      id: "diagnosis",
      title: "Diagnosis",
      included: true,
      rows: [
        { type: "choice_text", label: "Primary diagnosis", valuePrefix: "Primary diagnosis: ", selected: -1, options: ["Generalised Mild PI Gingivitis", "Generalised Moderate PI Gingivitis", "Localised Mild PI Gingivitis", "Localised Moderate PI Gingivitis", "Healthy gingival tissues", "Healthy gingival tissues w/ reduced periodontium", "Other"], customOptionIndex: 6, customValue: "", customPlaceholder: "Enter diagnosis" },
        { type: "choice_text", label: "Periodontal disease", valuePrefix: "Periodontal disease: ", selected: -1, options: ["Localised", "Generalised", "Molar-Incisor", "Localised posteriors", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter periodontal disease detail" },
        { type: "choice", label: "Stage", valuePrefix: "Stage: ", selected: -1, options: ["Stage 1", "Stage 2", "Stage 3", "Stage 4"] },
        { type: "choice", label: "Grade", valuePrefix: "Grade: ", selected: -1, options: ["Grade A", "Grade B", "Grade C"] },
        { type: "choice_text", label: "Modifying factor", valuePrefix: "Modifying factor: ", selected: -1, options: ["Caries as above", "Nil caries", "Incipient decay as above", "Secondary decay as above", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter modifying factor" }
      ]
    },
    {
      id: "risk-assessment",
      title: "Risk assessment",
      included: true,
      rows: [
        { type: "choice", label: "Caries", valuePrefix: "Caries risk: ", selected: -1, options: ["Low", "Medium", "High"] },
        { type: "choice", label: "Periodontal", valuePrefix: "Periodontal risk: ", selected: -1, options: ["Low", "Medium", "High"] },
        { type: "choice", label: "Oral Cancer", valuePrefix: "Oral cancer risk: ", selected: -1, options: ["Low", "Medium", "High"] }
      ]
    },
    {
      id: "tx-plan",
      title: "Tx Plan",
      included: true,
      rows: [
        { type: "line", text: "THIS VISIT:" },
        { type: "line", text: "1. S/C completed with US. Teeth polished with prophy paste. Topical Fluoride 9000ppm applied on teeth and POIG." },
        { type: "choice_text", label: "OHI", valuePrefix: "OHI: ", selected: 0, options: ["Encouraged to keep up OH habits", "Other"], customOptionIndex: 1, customValue: "", customPlaceholder: "Enter OHI advice" }
      ]
    },
    createRestorationsSection("2. Restorations"),
    {
      id: "future-visits",
      title: "Future Visits",
      included: true,
      rows: [
        { type: "text", label: "Visit 2", prefix: "2. ", value: "", placeholder: "Enter future visit 2 plan" },
        { type: "text", label: "Visit 3", prefix: "3. ", value: "", placeholder: "Enter future visit 3 plan" },
        { type: "text", label: "Visit 4", prefix: "4. ", value: "", placeholder: "Enter future visit 4 plan" }
      ]
    },
    {
      id: "next-visit",
      title: "Next Visit",
      included: true,
      rows: [
        { type: "choice_text", label: "Booking", valuePrefix: "", selected: 0, options: ["Recall 6 months 30 mins for periodic checkup and s/c", "Book appt 1 week, 1hr for restos", "Book appt 1 week, 30mins for restos", "Other"], customOptionIndex: 3, customValue: "", customPlaceholder: "Enter next visit plan" }
      ]
    }
  ];
}

function createPlaceholderTemplateSections(title, subtitle) {
  return [
    {
      id: "placeholder",
      title,
      included: true,
      rows: [
        { type: "line", text: subtitle || "Template scaffold ready." },
        { type: "line", text: "Use this as the next branch-specific build target." }
      ]
    }
  ];
}

const TEMPLATE_LIBRARY = {
  restoration: { title: "Restoration Template", sections: createRestorationTemplateSections() },
  "new-patient-exam": { title: "New Patient Exam", sections: createNewPatientTemplateSections() },
  "recall-exam": { title: "Recall Exam", sections: createPlaceholderTemplateSections("Recall Exam", "Existing Adult recall flow placeholder.") },
  "child-recall-easy": { title: "Child Recall Easy", sections: createPlaceholderTemplateSections("Child Recall Easy", "Existing Child recall flow placeholder.") },
  "extraction-adult": { title: "Extraction - Adult", sections: createPlaceholderTemplateSections("Extraction - Adult", "Adult extraction branch placeholder.") },
  "extraction-child": { title: "Extraction - Child", sections: createPlaceholderTemplateSections("Extraction - Child", "Child extraction branch placeholder.") },
  "crown-fit": { title: "Crown - Fit", sections: createPlaceholderTemplateSections("Crown - Fit", "Crown fit branch placeholder.") },
  "crown-prep": { title: "Crown - Prep", sections: createPlaceholderTemplateSections("Crown - Prep", "Crown prep branch placeholder.") },
  "crown-recement": { title: "Crown - Recement", sections: createPlaceholderTemplateSections("Crown - Recement", "Crown recement branch placeholder.") },
  "periodontal-treatment": { title: "Periodontal - Treatment", sections: createPlaceholderTemplateSections("Periodontal - Treatment", "Periodontal treatment branch placeholder.") },
  "periodontal-emergency": { title: "Periodontal - Emergency", sections: createPlaceholderTemplateSections("Periodontal - Emergency", "Periodontal emergency branch placeholder.") },
  "child-new-0-6": { title: "New Child Exam (0-6)", sections: createPlaceholderTemplateSections("New Child Exam 0-6", "Child new patient branch placeholder.") },
  "child-new-6-8": { title: "New Child Exam (6-8)", sections: createPlaceholderTemplateSections("New Child Exam 6-8", "Child new patient branch placeholder.") },
  "child-new-9-12": { title: "New Child Exam (9-12)", sections: createPlaceholderTemplateSections("New Child Exam 9-12", "Child new patient branch placeholder.") },
  "child-new-12-18": { title: "New Child Exam (12-18)", sections: createPlaceholderTemplateSections("New Child Exam 12-18", "Child new patient branch placeholder.") }
};

const TEMPLATE_PICKER_OPTIONS = [
  { key: "restoration", label: "Restoration" },
  { key: "new-patient-exam", label: "Exam > New > Adult" },
  { key: "child-new-0-6", label: "Exam > New > Child > 0-6" },
  { key: "child-new-6-8", label: "Exam > New > Child > 6-8" },
  { key: "child-new-9-12", label: "Exam > New > Child > 9-12" },
  { key: "child-new-12-18", label: "Exam > New > Child > 12-18" },
  { key: "recall-exam", label: "Exam > Existing > Adult" },
  { key: "child-recall-easy", label: "Exam > Existing > Child" },
  { key: "extraction-adult", label: "Extraction > Adult" },
  { key: "extraction-child", label: "Extraction > Child" },
  { key: "crown-fit", label: "Crown > Fit" },
  { key: "crown-prep", label: "Crown > Prep" },
  { key: "crown-recement", label: "Crown > Recement" },
  { key: "periodontal-treatment", label: "Periodontal > Treatment" },
  { key: "periodontal-emergency", label: "Periodontal > Emergency" }
];

const landingView = document.getElementById("landingView");
const builderView = document.getElementById("builderView");
const bodyEl = document.body;
const builderTitleEl = document.getElementById("builderTitle");
const landingTemplateZone = document.getElementById("landingTemplateZone");
const landingTemplateGrid = document.getElementById("landingTemplateGrid");
const templateCards = document.querySelectorAll("[data-template-key]");
const examCard = document.getElementById("examCard");
const extractionCard = document.getElementById("extractionCard");
const crownCard = document.getElementById("crownCard");
const periodontalCard = document.getElementById("periodontalCard");
const examFlowView = document.getElementById("examFlowView");
const examFlowBackBtn = document.getElementById("examFlowBackBtn");
const extractionFlowView = document.getElementById("extractionFlowView");
const extractionFlowBackBtn = document.getElementById("extractionFlowBackBtn");
const crownFlowView = document.getElementById("crownFlowView");
const crownFlowBackBtn = document.getElementById("crownFlowBackBtn");
const periodontalFlowView = document.getElementById("periodontalFlowView");
const periodontalFlowBackBtn = document.getElementById("periodontalFlowBackBtn");
const examStepRoot = document.getElementById("examStepRoot");
const examStepNew = document.getElementById("examStepNew");
const examStepNewChild = document.getElementById("examStepNewChild");
const examStepExisting = document.getElementById("examStepExisting");
const examNewBtn = document.getElementById("examNewBtn");
const examExistingBtn = document.getElementById("examExistingBtn");
const examNewChildBtn = document.getElementById("examNewChildBtn");
const backBtn = document.getElementById("backBtn");
const templatePickerEl = document.getElementById("templatePicker");
const resetTemplateBtn = document.getElementById("resetTemplateBtn");
const builderEl = document.getElementById("builder");
const noteOutputEl = document.getElementById("noteOutput");
const copyNoteBtn = document.getElementById("copyNoteBtn");
const copyWarningEl = document.getElementById("copyWarning");
const randomCorgiIconEl = document.getElementById("randomCorgiIcon");
const landingBrandTitleEl = document.getElementById("landingBrandTitle");
const corgiSwapBtnEl = document.getElementById("corgiSwapBtn");
const landingClockTimeEl = document.getElementById("landingClockTime");
const landingClockDateEl = document.getElementById("landingClockDate");
const toothModal = document.getElementById("toothModal");
const toothModalTitleEl = document.getElementById("toothModalTitle");
const toothGridEl = document.getElementById("toothGrid");
const surfaceGridEl = document.getElementById("surfaceGrid");
const toothSelectionPreviewEl = document.getElementById("toothSelectionPreview");
const addToothSelectionBtn = document.getElementById("addToothSelectionBtn");
const closeToothModalBtn = document.getElementById("closeToothModalBtn");
const cancelToothModalBtn = document.getElementById("cancelToothModalBtn");
const surfaceSectionEl = document.querySelector(".surface-section");

const TOOTH_GROUPS = [
  { label: "Upper Right", teeth: ["18", "17", "16", "15", "14", "13", "12", "11"] },
  { label: "Upper Left", teeth: ["21", "22", "23", "24", "25", "26", "27", "28"] },
  { label: "Lower Right", teeth: ["48", "47", "46", "45", "44", "43", "42", "41"] },
  { label: "Lower Left", teeth: ["31", "32", "33", "34", "35", "36", "37", "38"] },
  { label: "Upper Primary Right", teeth: ["55", "54", "53", "52", "51"] },
  { label: "Upper Primary Left", teeth: ["61", "62", "63", "64", "65"] },
  { label: "Lower Primary Right", teeth: ["85", "84", "83", "82", "81"] },
  { label: "Lower Primary Left", teeth: ["71", "72", "73", "74", "75"] }
];
const SURFACE_OPTIONS = ["M", "O", "D", "B", "L"];

let currentTemplateKey = "restoration";
let template = [];
let copyWarningTimer = null;
let examFlowStep = "root";
const toothModalState = { sectionIndex: -1, rowIndex: -1, selectedTooth: "", selectedSurfaces: new Set(), includeSurfaces: true };
const corgiIcons = ["assets/corgi/corgi-split-1.png", "assets/corgi/corgi-split-2.png", "assets/corgi/corgi-split-3.png"];
const rareMascotIcons = ["assets/corgi/ragdoll-split-1.png", "assets/corgi/ragdoll-split-2.png", "assets/corgi/ragdoll-split-3.png"];
const mascotEasterEggClickCount = 10;
const mascotEasterEggWindowMs = 5000;
let corgiIconIndex = 0;
let rareMascotIndex = 0;
let isRareMascot = false;
let mascotClickTimestamps = [];

function shouldTriggerRareMascotByClicks() {
  const now = Date.now();
  mascotClickTimestamps.push(now);
  mascotClickTimestamps = mascotClickTimestamps.filter((ts) => now - ts <= mascotEasterEggWindowMs);
  return mascotClickTimestamps.length >= mascotEasterEggClickCount;
}

function applyMascotIcon() {
  if (!randomCorgiIconEl) {
    return;
  }

  if (landingBrandTitleEl) {
    landingBrandTitleEl.textContent = isRareMascot ? "Champoku" : "Pogoku";
  }

  if (isRareMascot) {
    randomCorgiIconEl.src = rareMascotIcons[rareMascotIndex];
    randomCorgiIconEl.classList.remove("rare-sprite");
    randomCorgiIconEl.style.objectPosition = "";
    return;
  }

  randomCorgiIconEl.src = corgiIcons[corgiIconIndex];
  randomCorgiIconEl.classList.remove("rare-sprite");
  randomCorgiIconEl.style.objectPosition = "";
}

if (randomCorgiIconEl) {
  isRareMascot = Math.random() < 0.01;
  if (isRareMascot) {
    rareMascotIndex = Math.floor(Math.random() * rareMascotIcons.length);
  } else {
    corgiIconIndex = Math.floor(Math.random() * corgiIcons.length);
  }
  applyMascotIcon();
}

if (corgiSwapBtnEl && randomCorgiIconEl) {
  corgiSwapBtnEl.addEventListener("click", () => {
    if (!isRareMascot && shouldTriggerRareMascotByClicks()) {
      isRareMascot = true;
      rareMascotIndex = Math.floor(Math.random() * rareMascotIcons.length);
      mascotClickTimestamps = [];
      applyMascotIcon();
      return;
    }

    if (isRareMascot) {
      rareMascotIndex = (rareMascotIndex + 1) % rareMascotIcons.length;
    } else {
      corgiIconIndex = (corgiIconIndex + 1) % corgiIcons.length;
    }
    applyMascotIcon();
  });
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function updateLandingClock() {
  if (!landingClockTimeEl || !landingClockDateEl) {
    return;
  }

  const now = new Date();
  landingClockTimeEl.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  landingClockDateEl.textContent = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function startLandingClock() {
  if (!landingClockTimeEl || !landingClockDateEl) {
    return;
  }
  updateLandingClock();
  window.setInterval(updateLandingClock, 1000);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function loadTemplate(key) {
  if (!TEMPLATE_LIBRARY[key]) {
    return;
  }
  currentTemplateKey = key;
  template = deepClone(TEMPLATE_LIBRARY[key].sections);
  if (builderTitleEl) {
    builderTitleEl.textContent = TEMPLATE_LIBRARY[key].title;
  }
  if (templatePickerEl) {
    templatePickerEl.value = key;
  }
  closeToothModal();
  renderBuilder();
  renderOutput();
}

function buildTemplatePicker() {
  if (!templatePickerEl) {
    return;
  }
  templatePickerEl.innerHTML = "";

  TEMPLATE_PICKER_OPTIONS.forEach((optionConfig) => {
    if (!TEMPLATE_LIBRARY[optionConfig.key]) {
      return;
    }
    const option = document.createElement("option");
    option.value = optionConfig.key;
    option.textContent = optionConfig.label;
    templatePickerEl.appendChild(option);
  });
}

function syncEditedNoteToPlainText() {
  if (!noteOutputEl) {
    return;
  }
  const edited = noteOutputEl.innerText || "";
  noteOutputEl.dataset.plainText = edited.replace(/\r\n/g, "\n");
}

function getRestorationMode(section) {
  if (section.id !== "restorations") {
    return null;
  }
  const typeRow = section.rows.find((row) => row.label === "Resto type");
  if (!typeRow || !Array.isArray(typeRow.modeValues)) {
    return null;
  }
  return typeRow.modeValues[typeRow.selected] || null;
}

function getRowSelectedText(row) {
  if (row.type === "choice" || row.type === "choice_text") {
    return row.options[row.selected] || "";
  }
  return "";
}

function isRowVisible(section, row, restorationMode) {
  if (row.deleted) {
    return false;
  }
  if (row.showWhen && row.showWhen !== restorationMode) {
    return false;
  }
  if (row.showIf) {
    const dependencyRow = section.rows.find((candidate) => candidate.label === row.showIf.label);
    if (!dependencyRow) {
      return false;
    }
    const selectedText = getRowSelectedText(dependencyRow);
    if (Object.prototype.hasOwnProperty.call(row.showIf, "equals")) {
      return selectedText === row.showIf.equals;
    }
    if (Object.prototype.hasOwnProperty.call(row.showIf, "notEquals")) {
      return selectedText !== row.showIf.notEquals;
    }
    return true;
  }
  return true;
}
function canDeleteRow(row) {
  return row.deletable !== false;
}

function appendRowWithDelete(sectionEl, contentEl, sectionIndex, rowIndex, row) {
  const wrap = document.createElement("div");
  wrap.className = "row-wrap";
  if (row.linkedTo) {
    wrap.classList.add("row-link-wrap");
    contentEl.classList.add("row-linked");
    const linkPill = document.createElement("span");
    linkPill.className = "row-link-pill";
    linkPill.textContent = "LINK";
    linkPill.title = `Linked to ${row.linkedTo}`;
    wrap.appendChild(linkPill);
  }
  if (canDeleteRow(row)) {
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "row-delete-btn";
    removeBtn.textContent = "×";
    removeBtn.title = "Remove line";
    removeBtn.setAttribute("aria-label", `Remove ${row.label || "line"}`);
    removeBtn.addEventListener("click", () => {
      template[sectionIndex].rows[rowIndex].deleted = true;
      renderBuilder();
      renderOutput();
    });
    wrap.appendChild(removeBtn);
  }
  wrap.appendChild(contentEl);
  sectionEl.appendChild(wrap);
}

function setViewportMode(mode) {
  if (!bodyEl) {
    return;
  }
  bodyEl.classList.toggle("landing-mode", mode === "landing");
  bodyEl.classList.toggle("builder-mode", mode === "builder");
}

function animatePathwayEnter(pathwayEl, sourceEl) {
  if (!pathwayEl) {
    return;
  }

  let originX = 50;
  let originY = 50;

  if (sourceEl) {
    const sourceRect = sourceEl.getBoundingClientRect();
    const pathwayRect = pathwayEl.getBoundingClientRect();
    if (pathwayRect.width > 0 && pathwayRect.height > 0) {
      originX = ((sourceRect.left + sourceRect.width / 2 - pathwayRect.left) / pathwayRect.width) * 100;
      originY = ((sourceRect.top + sourceRect.height / 2 - pathwayRect.top) / pathwayRect.height) * 100;
      originX = Math.max(0, Math.min(100, originX));
      originY = Math.max(0, Math.min(100, originY));
    }
  }

  pathwayEl.style.setProperty("--pathway-origin-x", `${originX}%`);
  pathwayEl.style.setProperty("--pathway-origin-y", `${originY}%`);
  pathwayEl.classList.remove("pathway-enter");
  void pathwayEl.offsetWidth;
  pathwayEl.classList.add("pathway-enter");

  window.setTimeout(() => {
    pathwayEl.classList.remove("pathway-enter");
  }, 260);
}

function mountPathwaysInTemplateZone() {
  if (!landingTemplateZone) {
    return;
  }
  [examFlowView, extractionFlowView, crownFlowView, periodontalFlowView].forEach((panel) => {
    if (panel) {
      landingTemplateZone.appendChild(panel);
    }
  });
}

function showBuilder(templateKey) {
  if (templateKey) {
    loadTemplate(templateKey);
  }
  if (landingTemplateGrid) {
    landingTemplateGrid.classList.remove("hidden");
  }
  hideAllPathways();
  landingView.classList.add("hidden");
  builderView.classList.remove("hidden");
  setViewportMode("builder");
}

function showLanding() {
  builderView.classList.add("hidden");
  landingView.classList.remove("hidden");
  if (landingTemplateGrid) {
    landingTemplateGrid.classList.remove("hidden");
  }
  hideAllPathways();
  setViewportMode("landing");
}

function hideAllPathways() {
  if (examFlowView) {
    examFlowView.classList.add("hidden");
  }
  if (extractionFlowView) {
    extractionFlowView.classList.add("hidden");
  }
  if (crownFlowView) {
    crownFlowView.classList.add("hidden");
  }
  if (periodontalFlowView) {
    periodontalFlowView.classList.add("hidden");
  }
}

function renderExamFlow() {
  if (!examFlowView) {
    return;
  }
  const show = (el, visible) => {
    if (!el) return;
    el.classList.toggle("hidden", !visible);
  };
  show(examStepRoot, examFlowStep === "root");
  show(examStepNew, examFlowStep === "new");
  show(examStepNewChild, examFlowStep === "new-child");
  show(examStepExisting, examFlowStep === "existing");
}

function openExamFlow(sourceEl) {
  if (!examFlowView) {
    return;
  }
  examFlowStep = "root";
  if (landingTemplateGrid) {
    landingTemplateGrid.classList.add("hidden");
  }
  hideAllPathways();
  examFlowView.classList.remove("hidden");
  renderExamFlow();
  animatePathwayEnter(examFlowView, sourceEl);
}

function examFlowBack() {
  if (examFlowStep === "new-child") {
    examFlowStep = "new";
  } else if (examFlowStep === "new" || examFlowStep === "existing") {
    examFlowStep = "root";
  } else {
    if (landingTemplateGrid) {
      landingTemplateGrid.classList.remove("hidden");
    }
    examFlowView.classList.add("hidden");
  }
  renderExamFlow();
}

function openExtractionFlow(sourceEl) {
  if (!extractionFlowView) {
    return;
  }
  if (landingTemplateGrid) {
    landingTemplateGrid.classList.add("hidden");
  }
  hideAllPathways();
  extractionFlowView.classList.remove("hidden");
  animatePathwayEnter(extractionFlowView, sourceEl);
}

function closeExtractionFlow() {
  if (landingTemplateGrid) {
    landingTemplateGrid.classList.remove("hidden");
  }
  if (extractionFlowView) {
    extractionFlowView.classList.add("hidden");
  }
}

function openCrownFlow(sourceEl) {
  if (!crownFlowView) {
    return;
  }
  if (landingTemplateGrid) {
    landingTemplateGrid.classList.add("hidden");
  }
  hideAllPathways();
  crownFlowView.classList.remove("hidden");
  animatePathwayEnter(crownFlowView, sourceEl);
}

function closeCrownFlow() {
  if (landingTemplateGrid) {
    landingTemplateGrid.classList.remove("hidden");
  }
  if (crownFlowView) {
    crownFlowView.classList.add("hidden");
  }
}

function openPeriodontalFlow(sourceEl) {
  if (!periodontalFlowView) {
    return;
  }
  if (landingTemplateGrid) {
    landingTemplateGrid.classList.add("hidden");
  }
  hideAllPathways();
  periodontalFlowView.classList.remove("hidden");
  animatePathwayEnter(periodontalFlowView, sourceEl);
}

function closePeriodontalFlow() {
  if (landingTemplateGrid) {
    landingTemplateGrid.classList.remove("hidden");
  }
  if (periodontalFlowView) {
    periodontalFlowView.classList.add("hidden");
  }
}

function closeToothModal() {
  toothModal.classList.add("hidden");
  toothModal.setAttribute("aria-hidden", "true");
  toothModalState.sectionIndex = -1;
  toothModalState.rowIndex = -1;
  toothModalState.selectedTooth = "";
  toothModalState.selectedSurfaces = new Set();
  toothModalState.includeSurfaces = true;
}

function updateToothModalUi() {
  toothGridEl.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tooth === toothModalState.selectedTooth);
  });
  surfaceGridEl.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", toothModalState.selectedSurfaces.has(button.dataset.surface));
  });

  const surfaces = toothModalState.includeSurfaces
    ? SURFACE_OPTIONS.filter((value) => toothModalState.selectedSurfaces.has(value)).join("")
    : "";

  toothSelectionPreviewEl.textContent = toothModalState.selectedTooth
    ? `Selected: ${toothModalState.selectedTooth}${surfaces ? ` ${surfaces}` : ""}`
    : "Selected: none";

  addToothSelectionBtn.disabled = !toothModalState.selectedTooth;
}

function openToothModal(sectionIndex, rowIndex, options = {}) {
  const includeSurfaces = options.includeSurfaces ?? true;
  const title = options.title || (includeSurfaces ? "Select tooth and surfaces" : "Select teeth");

  toothModalState.sectionIndex = sectionIndex;
  toothModalState.rowIndex = rowIndex;
  toothModalState.selectedTooth = "";
  toothModalState.selectedSurfaces = new Set();
  toothModalState.includeSurfaces = includeSurfaces;

  toothModal.classList.remove("hidden");
  toothModal.setAttribute("aria-hidden", "false");
  toothModalTitleEl.textContent = title;
  if (surfaceSectionEl) {
    surfaceSectionEl.classList.toggle("hidden", !includeSurfaces);
  }
  updateToothModalUi();
}

function buildToothModal() {
  toothGridEl.innerHTML = "";
  surfaceGridEl.innerHTML = "";

  TOOTH_GROUPS.forEach((group) => {
    const groupEl = document.createElement("div");
    groupEl.className = "tooth-group";

    const title = document.createElement("p");
    title.className = "tooth-group-label";
    title.textContent = group.label;
    groupEl.appendChild(title);

    const row = document.createElement("div");
    row.className = "tooth-row";

    group.teeth.forEach((tooth) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tooth-btn";
      button.dataset.tooth = tooth;
      button.textContent = tooth;
      button.addEventListener("click", () => {
        toothModalState.selectedTooth = tooth;
        updateToothModalUi();
      });
      row.appendChild(button);
    });

    groupEl.appendChild(row);
    toothGridEl.appendChild(groupEl);
  });

  SURFACE_OPTIONS.forEach((surface) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "surface-btn";
    button.dataset.surface = surface;
    button.textContent = surface;
    button.addEventListener("click", () => {
      if (toothModalState.selectedSurfaces.has(surface)) {
        toothModalState.selectedSurfaces.delete(surface);
      } else {
        toothModalState.selectedSurfaces.add(surface);
      }
      updateToothModalUi();
    });
    surfaceGridEl.appendChild(button);
  });
}

function showCopyWarning(message) {
  if (!copyWarningEl) {
    return;
  }
  if (copyWarningTimer) {
    window.clearTimeout(copyWarningTimer);
  }

  copyWarningEl.textContent = message;
  copyWarningEl.classList.remove("hidden");
  copyWarningTimer = window.setTimeout(() => {
    copyWarningEl.classList.add("hidden");
    copyWarningEl.textContent = "";
  }, 2200);
}

function hasMissingRequiredSigMedHx() {
  if (currentTemplateKey !== "restoration") {
    return false;
  }

  const restorationSection = template.find((section) => section.id === "restoration" && section.included);
  if (!restorationSection) {
    return false;
  }

  const sigMedHxRow = restorationSection.rows.find((row) => row.label === "Sig Med hx" && row.type === "choice_text");
  if (!sigMedHxRow) {
    return false;
  }

  if (sigMedHxRow.selected !== sigMedHxRow.customOptionIndex) {
    return false;
  }

  return !((sigMedHxRow.customValue || "").trim());
}

function resetTemplate() {
  loadTemplate(currentTemplateKey);
}

function renderToothPickerRow(sectionEl, sectionIndex, rowIndex, row, modalTitle) {
  const rowEl = document.createElement("div");
  rowEl.className = "row";

  const label = document.createElement("span");
  label.className = "row-label";
  label.textContent = row.label;

  const chips = document.createElement("div");
  chips.className = "chips";

  const nilChip = document.createElement("button");
  nilChip.type = "button";
  nilChip.className = "chip";
  nilChip.textContent = row.nilOptionLabel || "Nil";
  if (row.selectedMode === "nil") {
    nilChip.classList.add("active");
  }
  nilChip.addEventListener("click", () => {
    template[sectionIndex].rows[rowIndex].selectedMode = "nil";
    renderBuilder();
    renderOutput();
  });

  const selectTeethChip = document.createElement("button");
  selectTeethChip.type = "button";
  selectTeethChip.className = "chip";
  selectTeethChip.textContent = row.selectOptionLabel || "Select teeth";
  if (row.selectedMode === "teeth") {
    selectTeethChip.classList.add("active");
  }
  selectTeethChip.addEventListener("click", () => {
    template[sectionIndex].rows[rowIndex].selectedMode = "teeth";
    openToothModal(sectionIndex, rowIndex, { includeSurfaces: false, title: modalTitle || "Select teeth" });
    renderOutput();
  });

  chips.appendChild(nilChip);
  chips.appendChild(selectTeethChip);
  rowEl.appendChild(label);
  rowEl.appendChild(chips);

  if (Array.isArray(row.entries) && row.entries.length > 0) {
    const picked = document.createElement("div");
    picked.className = "picked-list";
    row.entries.forEach((entry, entryIndex) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "picked-item";
      item.textContent = entry;
      item.title = "Remove";
      item.addEventListener("click", () => {
        template[sectionIndex].rows[rowIndex].entries = row.entries.filter((_, idx) => idx !== entryIndex);
        renderBuilder();
        renderOutput();
      });
      picked.appendChild(item);
    });
    rowEl.appendChild(picked);
  }

  appendRowWithDelete(sectionEl, rowEl, sectionIndex, rowIndex, row);
}
function renderBuilder() {
  builderEl.innerHTML = "";

  template.forEach((section, sectionIndex) => {
    const restorationMode = getRestorationMode(section);
    const sectionEl = document.createElement("section");
    sectionEl.className = "section";

    const head = document.createElement("div");
    head.className = "section-head";

    const h3 = document.createElement("h3");
    h3.textContent = section.title;

    const include = document.createElement("label");
    include.className = "include-toggle";

    const includeInput = document.createElement("input");
    includeInput.type = "checkbox";
    includeInput.checked = section.included;
    includeInput.addEventListener("change", () => {
      template[sectionIndex].included = includeInput.checked;
      renderBuilder();
      renderOutput();
    });

    include.appendChild(includeInput);
    include.appendChild(document.createTextNode("Include section"));

    head.appendChild(h3);
    head.appendChild(include);
    sectionEl.appendChild(head);

    if (section.included) {
      section.rows.forEach((row, rowIndex) => {
        if (!isRowVisible(section, row, restorationMode)) {
          return;
        }

        if (row.type === "tooth_picker" || row.type === "pain_site") {
          renderToothPickerRow(sectionEl, sectionIndex, rowIndex, row, "Select teeth");
          return;
        }

        if (row.type === "tooth_surface_picker") {
          const rowEl = document.createElement("div");
          rowEl.className = "row";

          const label = document.createElement("span");
          label.className = "row-label";
          label.textContent = row.label;

          const actions = document.createElement("div");
          actions.className = "picker-actions";

          const addBtn = document.createElement("button");
          addBtn.type = "button";
          addBtn.className = "secondary add-tooth-btn";
          addBtn.textContent = "Add tooth/surface";
          addBtn.addEventListener("click", () => {
            openToothModal(sectionIndex, rowIndex, { includeSurfaces: true, title: "Select tooth and surfaces" });
          });
          actions.appendChild(addBtn);

          rowEl.appendChild(label);
          rowEl.appendChild(actions);

          if (row.entries.length > 0) {
            const picked = document.createElement("div");
            picked.className = "picked-list";
            row.entries.forEach((entry, entryIndex) => {
              const item = document.createElement("button");
              item.type = "button";
              item.className = "picked-item";
              item.textContent = entry;
              item.title = "Remove";
              item.addEventListener("click", () => {
                template[sectionIndex].rows[rowIndex].entries = row.entries.filter((_, idx) => idx !== entryIndex);
                renderBuilder();
                renderOutput();
              });
              picked.appendChild(item);
            });
            rowEl.appendChild(picked);
          }

          appendRowWithDelete(sectionEl, rowEl, sectionIndex, rowIndex, row);
          return;
        }

        if (row.type === "line") {
          const p = document.createElement("p");
          p.className = "static-line";
          p.textContent = row.text;
          const rowEl = document.createElement("div");
          rowEl.className = "row";
          rowEl.appendChild(p);
          appendRowWithDelete(sectionEl, rowEl, sectionIndex, rowIndex, row);
          return;
        }

        if (row.type === "choice_text") {
          const rowEl = document.createElement("div");
          rowEl.className = "row";

          const label = document.createElement("span");
          label.className = "row-label";
          label.textContent = row.label;

          const chips = document.createElement("div");
          chips.className = "chips";

          row.options.forEach((option, optionIndex) => {
            const chip = document.createElement("button");
            chip.className = "chip";
            chip.type = "button";
            chip.textContent = option;
            chip.setAttribute("aria-pressed", row.selected === optionIndex ? "true" : "false");

            if (row.selected === optionIndex) {
              chip.classList.add("active");
            }

            chip.addEventListener("click", () => {
              const selected = template[sectionIndex].rows[rowIndex].selected;
              template[sectionIndex].rows[rowIndex].selected = selected === optionIndex ? -1 : optionIndex;
              renderBuilder();
              renderOutput();
            });

            chips.appendChild(chip);
          });

          rowEl.appendChild(label);
          rowEl.appendChild(chips);

          if (row.selected === row.customOptionIndex) {
            const input = document.createElement("input");
            input.className = "line-input";
            input.type = "text";
            input.value = row.customValue || "";
            input.placeholder = row.customPlaceholder || "";
            let warningEl = null;
            input.addEventListener("input", () => {
              template[sectionIndex].rows[rowIndex].customValue = input.value;
              renderOutput();

              const isEmpty = !(input.value || "").trim();
              if (row.customRequired && isEmpty && !warningEl) {
                warningEl = document.createElement("p");
                warningEl.className = "field-warning";
                warningEl.textContent = row.customRequiredMessage || "Please complete this field.";
                rowEl.appendChild(warningEl);
              } else if ((!row.customRequired || !isEmpty) && warningEl) {
                warningEl.remove();
                warningEl = null;
              }
            });
            rowEl.appendChild(input);

            if (row.customRequired && !(row.customValue || "").trim()) {
              warningEl = document.createElement("p");
              warningEl.className = "field-warning";
              warningEl.textContent = row.customRequiredMessage || "Please complete this field.";
              rowEl.appendChild(warningEl);
            }
          }

          appendRowWithDelete(sectionEl, rowEl, sectionIndex, rowIndex, row);
          return;
        }

        if (row.type === "text") {
          const rowEl = document.createElement("div");
          rowEl.className = "row";

          const label = document.createElement("span");
          label.className = "row-label";
          label.textContent = row.label;

          const input = document.createElement("input");
          input.className = "line-input";
          input.type = "text";
          input.value = row.value || "";
          input.placeholder = row.placeholder || "";
          input.addEventListener("input", () => {
            template[sectionIndex].rows[rowIndex].value = input.value;
            renderOutput();
          });

          rowEl.appendChild(label);
          rowEl.appendChild(input);

          if (row.suffix) {
            const suffix = document.createElement("p");
            suffix.className = "static-line";
            suffix.textContent = row.suffix;
            rowEl.appendChild(suffix);
          }

          appendRowWithDelete(sectionEl, rowEl, sectionIndex, rowIndex, row);
          return;
        }

        if (row.type === "multi_choice") {
          const rowEl = document.createElement("div");
          rowEl.className = "row";

          const label = document.createElement("span");
          label.className = "row-label";
          label.textContent = row.label;

          const chips = document.createElement("div");
          chips.className = "chips";

          row.options.forEach((option, optionIndex) => {
            const chip = document.createElement("button");
            chip.className = "chip";
            chip.type = "button";
            chip.textContent = option;
            const isActive = Array.isArray(row.selected) && row.selected.includes(optionIndex);
            chip.setAttribute("aria-pressed", isActive ? "true" : "false");

            if (isActive) {
              chip.classList.add("active");
            }

            chip.addEventListener("click", () => {
              const selected = Array.isArray(template[sectionIndex].rows[rowIndex].selected)
                ? [...template[sectionIndex].rows[rowIndex].selected]
                : [];
              const index = selected.indexOf(optionIndex);
              if (index >= 0) {
                selected.splice(index, 1);
              } else {
                selected.push(optionIndex);
              }
              template[sectionIndex].rows[rowIndex].selected = selected;
              renderBuilder();
              renderOutput();
            });

            chips.appendChild(chip);
          });

          rowEl.appendChild(label);
          rowEl.appendChild(chips);
          appendRowWithDelete(sectionEl, rowEl, sectionIndex, rowIndex, row);
          return;
        }

        const rowEl = document.createElement("div");
        rowEl.className = "row";

        const label = document.createElement("span");
        label.className = "row-label";
        label.textContent = row.label;

        const chips = document.createElement("div");
        chips.className = "chips";

        row.options.forEach((option, optionIndex) => {
          const chip = document.createElement("button");
          chip.className = "chip";
          chip.type = "button";
          chip.textContent = option;
          chip.setAttribute("aria-pressed", row.selected === optionIndex ? "true" : "false");

          if (row.selected === optionIndex) {
            chip.classList.add("active");
          }

          chip.addEventListener("click", () => {
            const selected = template[sectionIndex].rows[rowIndex].selected;
            template[sectionIndex].rows[rowIndex].selected = row.required ? optionIndex : (selected === optionIndex ? -1 : optionIndex);
            renderBuilder();
            renderOutput();
          });

          chips.appendChild(chip);
        });

        rowEl.appendChild(label);
        rowEl.appendChild(chips);
        appendRowWithDelete(sectionEl, rowEl, sectionIndex, rowIndex, row);
        return;
      });
    }

    builderEl.appendChild(sectionEl);
  });
}

function renderOutput() {
  const plainSections = [];
  const htmlSections = [];

  template.forEach((section) => {
    if (!section.included) {
      return;
    }

    const restorationMode = getRestorationMode(section);
    const plainLines = [];
    const htmlLines = [];
    plainLines.push(`${section.title}:`);
    htmlLines.push(`${escapeHtml(section.title)}:`);

    section.rows.forEach((row) => {
      if (!isRowVisible(section, row, restorationMode)) {
        return;
      }

      if (row.type === "line") {
        plainLines.push(row.text);
        htmlLines.push(escapeHtml(row.text));
        return;
      }

      if (row.type === "tooth_picker" || row.type === "pain_site") {
        if (row.selectedMode === "nil") {
          const line = `${row.valuePrefix}${row.nilOutputText || "Nil"}`;
          plainLines.push(line);
          htmlLines.push(escapeHtml(line));
          return;
        }
        if (Array.isArray(row.entries) && row.entries.length > 0) {
          const line = `${row.valuePrefix}${row.entries.join(", ")}`.trim();
          plainLines.push(line);
          htmlLines.push(escapeHtml(line));
        }
        return;
      }

      if (row.type === "tooth_surface_picker") {
        if (!Array.isArray(row.entries) || row.entries.length === 0) {
          return;
        }
        const line = `${row.valuePrefix}${row.entries.join(", ")}`.trim();
        plainLines.push(line);
        htmlLines.push(escapeHtml(line));
        return;
      }

      if (row.type === "multi_choice") {
        const selectedIndices = Array.isArray(row.selected) ? row.selected : [];
        const selectedValues = selectedIndices.map((index) => row.options[index]).filter(Boolean);
        if (selectedValues.length === 0) {
          return;
        }
        const plainLine = `${row.valuePrefix}${selectedValues.join(", ")}`.trim();
        plainLines.push(plainLine);
        if (row.bold) {
          const boldValues = selectedValues.map((value) => `<strong>${escapeHtml(value)}</strong>`).join(", ");
          htmlLines.push(`${escapeHtml(row.valuePrefix)}${boldValues}`.trim());
        } else {
          htmlLines.push(escapeHtml(plainLine));
        }
        return;
      }

      if (row.type === "text") {
        const value = (row.value || "").trim();
        if (!value) {
          return;
        }
        const prefixed = row.prefix ? `${row.prefix}${value}` : value;
        const line = row.suffix ? `${prefixed} ${row.suffix}` : prefixed;
        plainLines.push(line);
        htmlLines.push(escapeHtml(line));
        return;
      }

      if (row.type === "choice_text") {
        const selectedOption = row.options[row.selected];
        if (!selectedOption) {
          return;
        }

        if (row.selected === row.customOptionIndex) {
          const customValue = (row.customValue || "").trim();
          if (!customValue) {
            return;
          }
          const line = `${row.valuePrefix}${customValue}`.trim();
          plainLines.push(line);
          htmlLines.push(escapeHtml(line));
          return;
        }

        const line = `${row.valuePrefix}${selectedOption}`.trim();
        plainLines.push(line);
        htmlLines.push(escapeHtml(line));
        return;
      }

      const selectedOption = row.options[row.selected];
      if (!selectedOption) {
        return;
      }

      const line = `${row.valuePrefix}${selectedOption}`.trim();
      plainLines.push(line);
      htmlLines.push(escapeHtml(line));
    });

    if (plainLines.length > 1) {
      plainSections.push(plainLines.join("\n"));
      htmlSections.push(htmlLines.join("<br>"));
    }
  });

  const plainText = plainSections.join("\n\n");
  noteOutputEl.dataset.plainText = plainText;
  noteOutputEl.innerHTML = htmlSections.join("<br><br>");
}
async function copyNote() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (hasMissingRequiredSigMedHx()) {
    showCopyWarning("Add significant med hx details before copying.");
    scrollToTop();
    return;
  }

  const text = (noteOutputEl.dataset.plainText || noteOutputEl.textContent || "").trim();
  if (!text) {
    copyNoteBtn.textContent = "Nothing to copy";
    scrollToTop();
    window.setTimeout(() => {
      copyNoteBtn.textContent = "Copy Note";
    }, 1200);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copyNoteBtn.textContent = "Copied";
  } catch (error) {
    copyNoteBtn.textContent = "Copy failed";
  }
  scrollToTop();

  window.setTimeout(() => {
    copyNoteBtn.textContent = "Copy Note";
  }, 1200);
}

addToothSelectionBtn.addEventListener("click", () => {
  if (toothModalState.sectionIndex < 0 || toothModalState.rowIndex < 0 || !toothModalState.selectedTooth) {
    return;
  }

  const section = template[toothModalState.sectionIndex];
  const row = section.rows[toothModalState.rowIndex];
  const surfaces = SURFACE_OPTIONS.filter((value) => toothModalState.selectedSurfaces.has(value)).join("");
  const entry = toothModalState.includeSurfaces && surfaces ? `${toothModalState.selectedTooth} ${surfaces}` : toothModalState.selectedTooth;

  if (!row.entries.includes(entry)) {
    row.entries.push(entry);
  }
  if (row.type === "tooth_picker" || row.type === "pain_site") {
    row.selectedMode = "teeth";
  }

  closeToothModal();
  renderBuilder();
  renderOutput();
});

closeToothModalBtn.addEventListener("click", closeToothModal);
cancelToothModalBtn.addEventListener("click", closeToothModal);
toothModal.addEventListener("click", (event) => {
  if (event.target === toothModal) {
    closeToothModal();
  }
});

templateCards.forEach((card) => {
  const templateKey = card.dataset.templateKey;
  card.addEventListener("click", () => showBuilder(templateKey));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showBuilder(templateKey);
    }
  });
});

if (examCard) {
  examCard.addEventListener("click", (event) => openExamFlow(event.currentTarget));
  examCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openExamFlow(event.currentTarget);
    }
  });
}

if (extractionCard) {
  extractionCard.addEventListener("click", (event) => openExtractionFlow(event.currentTarget));
  extractionCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openExtractionFlow(event.currentTarget);
    }
  });
}

if (crownCard) {
  crownCard.addEventListener("click", (event) => openCrownFlow(event.currentTarget));
  crownCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCrownFlow(event.currentTarget);
    }
  });
}

if (periodontalCard) {
  periodontalCard.addEventListener("click", (event) => openPeriodontalFlow(event.currentTarget));
  periodontalCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPeriodontalFlow(event.currentTarget);
    }
  });
}

if (examFlowBackBtn) {
  examFlowBackBtn.addEventListener("click", examFlowBack);
}
if (extractionFlowBackBtn) {
  extractionFlowBackBtn.addEventListener("click", closeExtractionFlow);
}
if (crownFlowBackBtn) {
  crownFlowBackBtn.addEventListener("click", closeCrownFlow);
}
if (periodontalFlowBackBtn) {
  periodontalFlowBackBtn.addEventListener("click", closePeriodontalFlow);
}
if (examNewBtn) {
  examNewBtn.addEventListener("click", () => {
    examFlowStep = "new";
    renderExamFlow();
  });
}
if (examExistingBtn) {
  examExistingBtn.addEventListener("click", () => {
    examFlowStep = "existing";
    renderExamFlow();
  });
}
if (examNewChildBtn) {
  examNewChildBtn.addEventListener("click", () => {
    examFlowStep = "new-child";
    renderExamFlow();
  });
}

backBtn.addEventListener("click", showLanding);
if (resetTemplateBtn) {
  resetTemplateBtn.addEventListener("click", resetTemplate);
}
if (templatePickerEl) {
  templatePickerEl.addEventListener("change", () => {
    if (!templatePickerEl.value) {
      return;
    }
    showBuilder(templatePickerEl.value);
  });
}
copyNoteBtn.addEventListener("click", copyNote);
if (noteOutputEl) {
  noteOutputEl.addEventListener("input", syncEditedNoteToPlainText);
}

buildToothModal();
mountPathwaysInTemplateZone();
renderExamFlow();
buildTemplatePicker();
loadTemplate(currentTemplateKey);
startLandingClock();
setViewportMode("landing");
