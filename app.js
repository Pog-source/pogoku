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

// Single source of truth for shared note wording/labels.
const WORDING_STANDARD = {
  style: {
    patientTokenPreferred: "Patient",
    nilTokenPreferred: "Nil",
    sectionLabelCase: "Title Case",
    spellingVariant: "Australian English"
  },
  terms: {
    nil: "Nil",
    other: "Other",
    asAbove: "As above",
    noneIndicatedToday: "None indicated today",
    nextVisitPrefix: "n/v: "
  },
  labels: {
    bws: "BWs",
    pas: "PAs",
    sigMedHx: "Sig Med Hx",
    attendingWith: "Attending with",
    pcHx: "PC Hx",
    oe: "OE",
    findings: "Findings",
    rfaEmergencyAppt: "RFA: Emergency appt"
  },
  radiographs: {
    bwsTakenForCariesAndBoneLevels: "Taken for inter-proximal caries assessment and bone levels",
    bwsDeclinedExamIncomplete: "Patient declined bitewings - understands exam is not complete without radiographs",
    bwsUnableExamIncomplete: "Patient was not able to take bitewings - understands diagnosis may be incomplete",
    pasTakenForAssessment: "Taken to assess for PAP, bone levels, caries, and root morphology"
  },
  la: {
    topicalApplied: "Topical xylocaine applied",
    noTopicalRequired: "No topical required",
    methodOptions: ["Nil", "Infiltration", "IDB", "IDB + Infiltration", "Other"]
  },
  phrases: {
    informedConsentTreatment: "Patient gave informed verbal consent for treatment",
    informedConsentExtraction: "Patient gave informed verbal consent for extraction",
    informedConsentExtractionWithCarer: "Patient and carer gave informed verbal consent for extraction",
    patientSatisfiedOnDeparture: "Patient satisfied on departure"
  },
  defaults: {
    dentureStageLabel: "Existing pt returning for"
  }
};

const BWS_TAKEN_OPTION = WORDING_STANDARD.radiographs.bwsTakenForCariesAndBoneLevels;
const DENTURE_STAGE_LABEL = WORDING_STANDARD.defaults.dentureStageLabel;
const OPTION_SETS = {
  nilOther: [WORDING_STANDARD.terms.nil, WORDING_STANDARD.terms.other],
  yesNo: ["Yes", "No"],
  yesNoOther: ["Yes", "No", WORDING_STANDARD.terms.other],
  nilPainSensitivityOther: [WORDING_STANDARD.terms.nil, "Pain", "Sensitivity", WORDING_STANDARD.terms.other],
  nilMildModerateSevere: [WORDING_STANDARD.terms.nil, "Mild", "Moderate", "Severe"],
  laMethodIdb: [WORDING_STANDARD.terms.nil, "Infiltration", "IDB", "IDB + Infiltration", WORDING_STANDARD.terms.other],
  laMethodIanb: [WORDING_STANDARD.terms.nil, "Infiltration", "IANB", "IANB + Infiltration", WORDING_STANDARD.terms.other]
};

function createRadiographRows(config = {}) {
  const {
    bwsNotIndicatedOption = WORDING_STANDARD.terms.noneIndicatedToday,
    bwsDeclinedOption = WORDING_STANDARD.radiographs.bwsDeclinedExamIncomplete,
    cariesAsAboveOption = WORDING_STANDARD.terms.asAbove,
    cariesNilOption = WORDING_STANDARD.terms.nil,
    pasNoneIndicatedOption = WORDING_STANDARD.terms.noneIndicatedToday,
    pasTakenOption = WORDING_STANDARD.radiographs.pasTakenForAssessment
  } = config;
  const bwsLabel = WORDING_STANDARD.labels.bws;
  const pasLabel = WORDING_STANDARD.labels.pas;

  return [
    {
      type: "choice",
      label: bwsLabel,
      valuePrefix: `${bwsLabel}: `,
      selected: 0,
      options: [
        bwsNotIndicatedOption,
        BWS_TAKEN_OPTION,
        bwsDeclinedOption
      ]
    },
    {
      type: "choice",
      label: "Caries",
      valuePrefix: "Caries: ",
      selected: -1,
      options: [cariesAsAboveOption, cariesNilOption],
      showIf: { label: bwsLabel, equals: BWS_TAKEN_OPTION },
      linkedTo: bwsLabel
    },
    {
      type: "tooth_picker",
      label: "Endodontically treated teeth",
      valuePrefix: "Endodontically treated teeth: ",
      selectedMode: "nil",
      entries: [],
      showIf: { label: bwsLabel, equals: BWS_TAKEN_OPTION },
      linkedTo: bwsLabel
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
      showIf: { label: bwsLabel, equals: BWS_TAKEN_OPTION },
      linkedTo: bwsLabel
    },
    {
      type: "choice_text",
      label: `Other Findings from ${bwsLabel}`,
      valuePrefix: `Other Findings from ${bwsLabel}: `,
      selected: -1,
      options: [WORDING_STANDARD.terms.nil, WORDING_STANDARD.terms.other],
      customOptionIndex: 1,
      customValue: "",
      customPlaceholder: "Enter finding",
      showIf: { label: bwsLabel, equals: BWS_TAKEN_OPTION },
      linkedTo: bwsLabel
    },
    {
      type: "choice",
      label: pasLabel,
      valuePrefix: `${pasLabel}: `,
      selected: 0,
      options: [pasNoneIndicatedOption, pasTakenOption]
    }
  ];
}

function createLocalAnaestheticRows(options = {}) {
  const {
    topicalLabel = "Topical",
    topicalOptions = [WORDING_STANDARD.la.topicalApplied, WORDING_STANDARD.la.noTopicalRequired],
    topicalSelected = 0,
    includeTopical = true,
    methodLabel = "LA method",
    methodValuePrefix = "LA: ",
    methodOptions = [...WORDING_STANDARD.la.methodOptions],
    methodSelected = 0,
    methodCustomOptionIndex = 4,
    methodCustomPlaceholder = "Enter LA method",
    siteLabel = "Site",
    siteValuePrefix = "Site: ",
    includeSitePicker = true,
    agentLabel = "Agent",
    agentValuePrefix = "Agent: ",
    agentOptions = ["Articaine 4% 1:100,000 epinephrine", "Lidocaine 2% 1:80,000 epinephrine", "Mepivacaine 3%", "Other"],
    agentCustomOptionIndex = 3,
    agentCustomPlaceholder = "Enter anaesthetic agent",
    volumeLabel = "Vol",
    volumeValuePrefix = "Vol: ",
    volumeOptions = ["0.2mL", "0.5mL", "1.0mL", "1.2mL", "1.5mL", "2.2mL", "4.4mL", "6.6mL", "Other"],
    volumeCustomOptionIndex = 8,
    volumeCustomPlaceholder = "Enter volume",
    includeAgentAndVolume = true,
    hideDetailsWhen = WORDING_STANDARD.terms.nil
  } = options;

  const rows = [];

  if (includeTopical) {
    rows.push({
      type: "choice",
      label: topicalLabel,
      valuePrefix: "",
      selected: topicalSelected,
      options: topicalOptions
    });
  }

  rows.push({
      type: "choice_text",
      label: methodLabel,
      valuePrefix: methodValuePrefix,
      selected: methodSelected,
      options: methodOptions,
      customOptionIndex: methodCustomOptionIndex,
      customValue: "",
      customPlaceholder: methodCustomPlaceholder
    });

  const detailShowIf = { label: methodLabel, notEquals: hideDetailsWhen };

  if (includeSitePicker) {
    rows.push({
      type: "tooth_picker",
      label: siteLabel,
      valuePrefix: siteValuePrefix,
      selectedMode: "teeth",
      entries: [],
      selectOptionLabel: "Select site",
      showIf: detailShowIf
    });
  }

  if (includeAgentAndVolume) {
    rows.push(
      {
        type: "choice_text",
        label: agentLabel,
        valuePrefix: agentValuePrefix,
        selected: -1,
        options: agentOptions,
        customOptionIndex: agentCustomOptionIndex,
        customValue: "",
        customPlaceholder: agentCustomPlaceholder,
        showIf: detailShowIf
      },
      {
        type: "choice_text",
        label: volumeLabel,
        valuePrefix: volumeValuePrefix,
        selected: -1,
        options: volumeOptions,
        customOptionIndex: volumeCustomOptionIndex,
        customValue: "",
        customPlaceholder: volumeCustomPlaceholder,
        showIf: detailShowIf
      }
    );
  }

  return rows;
}

function createPainAssessmentRows(config = {}) {
  const {
    complaintLabel = "C/O",
    painValue = "Pain",
    sensitivityValue = "Sensitivity",
    includePainHeading = true,
    includeSitePicker = true,
    siteLabel = "Site",
    siteValuePrefix = "Site: ",
    includeSensitivitySite = false,
    sensitivitySiteLabel = "Sensitivity site",
    sensitivitySiteValuePrefix = "Sensitivity site: ",
    showIfExamType,
    showIfAgeBand
  } = config;

  const scope = {};
  if (typeof showIfExamType !== "undefined") {
    scope.showIfExamType = showIfExamType;
  }
  if (typeof showIfAgeBand !== "undefined") {
    scope.showIfAgeBand = showIfAgeBand;
  }

  const withScope = (row) => ({ ...row, ...scope });
  const painShowIf = { label: complaintLabel, equals: painValue };
  const rows = [];

  if (includePainHeading) {
    rows.push(
      withScope({
        type: "line",
        text: "Pain details:",
        showIf: painShowIf
      })
    );
  }

  if (includeSitePicker) {
    rows.push(
      withScope({
        type: "tooth_picker",
        label: siteLabel,
        valuePrefix: siteValuePrefix,
        selectedMode: "nil",
        entries: [],
        showIf: painShowIf
      })
    );
  }

  if (includeSensitivitySite) {
    rows.push(
      withScope({
        type: "tooth_picker",
        label: sensitivitySiteLabel,
        valuePrefix: sensitivitySiteValuePrefix,
        selectedMode: "nil",
        entries: [],
        showIf: { label: complaintLabel, equals: sensitivityValue }
      })
    );
  }

  rows.push(
    withScope({
      type: "choice_text",
      label: "Onset",
      valuePrefix: "Onset: ",
      selected: -1,
      options: ["Today", "Several days ago", "Over a week ago", "Months ago", WORDING_STANDARD.terms.other],
      customOptionIndex: 4,
      customValue: "",
      customPlaceholder: "Enter onset detail",
      showIf: painShowIf
    }),
    withScope({
      type: "choice_text",
      label: "Character",
      valuePrefix: "Character: ",
      selected: -1,
      options: ["Sharp", "Aching", "Throbbing", "Burning", "Itching", WORDING_STANDARD.terms.other],
      customOptionIndex: 5,
      customValue: "",
      customPlaceholder: "Enter character detail",
      showIf: painShowIf
    }),
    withScope({
      type: "choice_text",
      label: "Radiation",
      valuePrefix: "Radiation: ",
      selected: -1,
      options: [WORDING_STANDARD.terms.nil, "Head", "Neck", "Jaw", WORDING_STANDARD.terms.other],
      customOptionIndex: 4,
      customValue: "",
      customPlaceholder: "Enter radiation detail",
      showIf: painShowIf
    }),
    withScope({
      type: "choice_text",
      label: "Duration",
      valuePrefix: "Duration: ",
      selected: -1,
      options: ["Seconds", "Minutes", "Hours", "Constant", WORDING_STANDARD.terms.other],
      customOptionIndex: 4,
      customValue: "",
      customPlaceholder: "Enter duration detail",
      showIf: painShowIf
    }),
    withScope({
      type: "choice",
      label: "Severity",
      valuePrefix: "Severity: ",
      selected: -1,
      options: ["1/10", "2/10", "3/10", "4/10", "5/10", "6/10", "7/10", "8/10", "9/10", "10/10"],
      showIf: painShowIf
    })
  );

  return rows;
}

function createInformedConsentLine(text = WORDING_STANDARD.phrases.informedConsentTreatment) {
  return { type: "line", text };
}

function createStructuredConsentRows(config = {}) {
  const {
    optionsDiscussedChoices = [],
    optionsDiscussedDefault = 0,
    consentDiscussionDefault = 0,
    patientQuestionsDefault = 0,
    writtenConsentDefault = 0
  } = config;

  const safeOptionsChoices = Array.isArray(optionsDiscussedChoices) && optionsDiscussedChoices.length > 0
    ? optionsDiscussedChoices
    : ["Proceed with treatment", "Alternative treatment options", "No treatment/monitoring", WORDING_STANDARD.terms.other];

  return [
    {
      type: "choice_text",
      label: "Options discussed",
      valuePrefix: "Options discussed: ",
      selected: optionsDiscussedDefault,
      options: safeOptionsChoices,
      customOptionIndex: safeOptionsChoices.length - 1,
      customValue: "",
      customPlaceholder: "Enter options discussed",
      customRequired: true,
      customRequiredMessage: "Please enter what was discussed."
    },
    {
      type: "choice_text",
      label: "Consent discussion",
      valuePrefix: "Consent discussion: ",
      selected: consentDiscussionDefault,
      options: [
        "Risks, benefits and alternatives explained",
        "Risks/benefits explained and patient questions addressed",
        WORDING_STANDARD.terms.other
      ],
      customOptionIndex: 2,
      customValue: "",
      customPlaceholder: "Enter consent discussion details",
      customRequired: true,
      customRequiredMessage: "Please enter consent discussion details."
    },
    {
      type: "choice_text",
      label: "Patient questions",
      valuePrefix: "Patient questions: ",
      selected: patientQuestionsDefault,
      options: ["No further questions", "Questions asked and addressed", WORDING_STANDARD.terms.other],
      customOptionIndex: 2,
      customValue: "",
      customPlaceholder: "Enter patient questions/concerns",
      customRequired: true,
      customRequiredMessage: "Please enter patient question details."
    },
    {
      type: "choice_text",
      label: "Written consent",
      valuePrefix: "Written consent: ",
      selected: writtenConsentDefault,
      options: ["Not required", "Obtained", "Declined", WORDING_STANDARD.terms.other],
      customOptionIndex: 3,
      customValue: "",
      customPlaceholder: "Enter written consent details",
      customRequired: true,
      customRequiredMessage: "Please enter written consent details."
    },
    {
      type: "text",
      label: "Consent evidence",
      prefix: "Consent evidence: ",
      value: "",
      placeholder: "Info sheet/form version or documentation reference"
    }
  ];
}

function createMedicationAndAdverseEventRows(config = {}) {
  const {
    medicationDefault = 0,
    adverseDefault = 0
  } = config;

  const medicationLabel = "Medication prescribed/administered";
  const adverseLabel = "Complications/adverse events";
  const medicationOtherOrRx = ["Analgesic prescription issued", "Antibiotic prescription issued", WORDING_STANDARD.terms.other];

  return [
    {
      type: "choice_text",
      label: medicationLabel,
      valuePrefix: `${medicationLabel}: `,
      selected: medicationDefault,
      options: [
        WORDING_STANDARD.terms.nil,
        "Analgesic advice only (no prescription)",
        "Analgesic prescription issued",
        "Antibiotic prescription issued",
        WORDING_STANDARD.terms.other
      ],
      customOptionIndex: 4,
      customValue: "",
      customPlaceholder: "Enter medication summary",
      customRequired: true,
      customRequiredMessage: "Please enter medication details."
    },
    {
      type: "text",
      label: "Medication details",
      prefix: "Medication details: ",
      value: "",
      placeholder: "Drug, dose, route, frequency, duration, instructions",
      showIf: { label: medicationLabel, includesAny: medicationOtherOrRx }
    },
    {
      type: "choice_text",
      label: adverseLabel,
      valuePrefix: `${adverseLabel}: `,
      selected: adverseDefault,
      options: [
        WORDING_STANDARD.terms.nil,
        "Minor intra-op complication managed chairside",
        "Post-op adverse event discussed",
        WORDING_STANDARD.terms.other
      ],
      customOptionIndex: 3,
      customValue: "",
      customPlaceholder: "Enter complication/adverse event",
      customRequired: true,
      customRequiredMessage: "Please enter complication details."
    },
    {
      type: "text",
      label: "Complication management",
      prefix: "Complication management: ",
      value: "",
      placeholder: "Action taken, advice given, and follow-up arranged",
      showIf: { label: adverseLabel, notEquals: WORDING_STANDARD.terms.nil }
    }
  ];
}

function createNextVisitChoiceRow(config = {}) {
  const {
    label = "n/v",
    valuePrefix = WORDING_STANDARD.terms.nextVisitPrefix,
    selected = 0,
    options = [WORDING_STANDARD.terms.other],
    customOptionIndex,
    customValue = "",
    customPlaceholder = "Enter next visit"
  } = config;

  const safeOptions = Array.isArray(options) && options.length > 0 ? options : [WORDING_STANDARD.terms.other];
  const resolvedCustomIndex = Number.isInteger(customOptionIndex) ? customOptionIndex : Math.max(0, safeOptions.length - 1);

  return {
    type: "choice_text",
    label,
    valuePrefix,
    selected,
    options: safeOptions,
    customOptionIndex: resolvedCustomIndex,
    customValue,
    customPlaceholder
  };
}

function createDentureStagesTemplateSections() {
  const stageLinkedRow = (stageValue, row) => ({
    ...row,
    showIf: { label: DENTURE_STAGE_LABEL, equals: stageValue },
    showIfGlobal: true
  });

  return [
    {
      id: "denture-appointment",
      title: "Denture Appointment",
      included: true,
      rows: [
        {
          type: "choice",
          label: DENTURE_STAGE_LABEL,
          valuePrefix: "Existing pt returning for ",
          selected: 0,
          required: true,
          deletable: false,
          options: [
            "Primary impressions",
            "Secondary impressions",
            "Secondary impressions + Bite registration",
            "Bite registration",
            "Try in",
            "Fit"
          ]
        },
        {
          type: "choice_text",
          label: "MH",
          valuePrefix: "MH: ",
          selected: 0,
          options: ["No change", "Other"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter MH update",
          deletable: false
        }
      ]
    },
    {
      id: "denture-treatment-today",
      title: "Treatment Today",
      included: true,
      rows: [
        { type: "line", text: "VCG" },
        { type: "line", text: "Explained procedure to patient" },
        stageLinkedRow("Primary impressions", {
          type: "choice",
          label: "Tray preparation",
          valuePrefix: "",
          selected: 0,
          options: [
            "Upper and lower stock trays sprayed with adhesive",
            "Upper stock tray sprayed with adhesive",
            "Lower stock tray sprayed with adhesive"
          ]
        }),
        stageLinkedRow("Primary impressions", {
          type: "choice",
          label: "Primary impressions",
          valuePrefix: "",
          selected: 0,
          options: [
            "Upper and lower impressions taken in alginate",
            "Upper impression taken in alginate",
            "Lower impression taken in alginate"
          ]
        }),
        stageLinkedRow("Secondary impressions", { type: "line", text: "Secondary impressions completed." }),
        stageLinkedRow("Secondary impressions", { type: "line", text: "Peripheral seal and extension checked." }),
        stageLinkedRow("Secondary impressions + Bite registration", { type: "line", text: "Secondary impressions completed and bite registration recorded." }),
        stageLinkedRow("Secondary impressions + Bite registration", { type: "line", text: "Vertical dimension and centric relation checked." }),
        stageLinkedRow("Bite registration", { type: "line", text: "Bite registration taken after adjustments." }),
        stageLinkedRow("Bite registration", { type: "line", text: "Jaw relation records verified." }),
        stageLinkedRow("Try in", { type: "line", text: "Try in of denture with alterations made where needed." }),
        stageLinkedRow("Try in", { type: "line", text: "Pt shown in mirror and agreed with shade. Happy to continue to fit." }),
        stageLinkedRow("Try in", {
          type: "choice_text",
          label: "Shade confirmation",
          valuePrefix: "Patient shown in mirror and agreed with shade. Confirmed again as ",
          selected: -1,
          options: ["A1", "A2", "A3", "B1", "B2", "C2", "D2", "Other"],
          customOptionIndex: 7,
          customValue: "",
          customPlaceholder: "Enter shade"
        }),
        stageLinkedRow("Fit", { type: "line", text: "Tried denture in." }),
        stageLinkedRow("Fit", {
          type: "choice_text",
          label: "Adjustments needed",
          valuePrefix: "Adjustments needed: ",
          selected: 0,
          options: OPTION_SETS.nilOther,
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter adjustments"
        }),
        stageLinkedRow("Fit", { type: "line", text: "Checked for balanced occlusion." }),
        stageLinkedRow("Fit", { type: "line", text: "Denture hygiene regime discussed." }),
        stageLinkedRow("Fit", {
          type: "line",
          text: "Care advice given: leave out at night to avoid infections, clean daily with soapy water and fill sink with water to avoid breakage if dropped. Once a week use Steradent or Milton baby bottle solution overnight."
        }),
        stageLinkedRow("Fit", { type: "line", text: "Advised to keep it in and practice speaking at home to adjust to new denture." }),
        stageLinkedRow("Fit", {
          type: "line",
          text: "Advised to remove denture if it is causing ulceration or sore spots and book in for adjustments if needed."
        })
      ]
    },
    {
      id: "denture-labwork",
      title: "Labwork",
      included: true,
      rows: [
        stageLinkedRow("Primary impressions", { type: "line", text: "Impressions disinfected." }),
        stageLinkedRow("Primary impressions", {
          type: "choice_text",
          label: "Labwork sent to",
          valuePrefix: "Labwork sent to: ",
          selected: 0,
          options: ["Unidental", "Other"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter lab"
        }),
        stageLinkedRow("Secondary impressions", { type: "line", text: "Impressions disinfected." }),
        stageLinkedRow("Secondary impressions", {
          type: "choice_text",
          label: "Labwork sent to",
          valuePrefix: "Labwork sent to: ",
          selected: 0,
          options: ["Unidental", "Other"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter lab"
        }),
        stageLinkedRow("Secondary impressions + Bite registration", { type: "line", text: "Impressions and bite records disinfected." }),
        stageLinkedRow("Secondary impressions + Bite registration", {
          type: "choice_text",
          label: "Labwork sent to",
          valuePrefix: "Labwork sent to: ",
          selected: 0,
          options: ["Unidental", "Other"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter lab"
        }),
        stageLinkedRow("Bite registration", { type: "line", text: "Bite records disinfected." }),
        stageLinkedRow("Bite registration", {
          type: "choice_text",
          label: "Shade agreed with patient",
          valuePrefix: "Shade agreed with patient: ",
          selected: -1,
          options: ["A1", "A2", "A3", "B1", "B2", "C2", "D2", "Other"],
          customOptionIndex: 7,
          customValue: "",
          customPlaceholder: "Enter shade"
        }),
        stageLinkedRow("Try in", { type: "line", text: "Labwork disinfected." }),
        stageLinkedRow("Try in", {
          type: "choice_text",
          label: "Labwork sent to",
          valuePrefix: "Labwork sent to: ",
          selected: 0,
          options: ["Unidental", "Other"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter lab"
        }),
        stageLinkedRow("Fit", { type: "line", text: "Nil" })
      ]
    },
    {
      id: "denture-next-visit",
      title: "Next Visit",
      included: true,
      rows: [
        stageLinkedRow("Primary impressions", createNextVisitChoiceRow({
          label: "Booking",
          valuePrefix: "",
          selected: 0,
          options: ["Secondary impressions + Bite registration", "Secondary impression", "Bite rego 20mins", "Other"],
          customOptionIndex: 3,
          customPlaceholder: "Enter next visit"
        })),
        stageLinkedRow("Secondary impressions", createNextVisitChoiceRow({
          label: "Booking",
          valuePrefix: "",
          selected: 0,
          options: ["Secondary impressions + Bite registration", "Bite registration", "Try in", "Other"],
          customOptionIndex: 3,
          customPlaceholder: "Enter next visit"
        })),
        stageLinkedRow("Secondary impressions + Bite registration", createNextVisitChoiceRow({
          label: "Booking",
          valuePrefix: "",
          selected: 0,
          options: ["Try in", "Fit", "Other"],
          customOptionIndex: 2,
          customPlaceholder: "Enter next visit"
        })),
        stageLinkedRow("Bite registration", createNextVisitChoiceRow({
          label: "Booking",
          valuePrefix: "",
          selected: 0,
          options: ["Try in 20mins", "Try in", "Other"],
          customOptionIndex: 2,
          customPlaceholder: "Enter next visit"
        })),
        stageLinkedRow("Try in", createNextVisitChoiceRow({
          label: "Booking",
          valuePrefix: "",
          selected: 0,
          options: ["Retry", "Fit", "Other"],
          customOptionIndex: 2,
          customPlaceholder: "Enter next visit"
        })),
        stageLinkedRow("Fit", createNextVisitChoiceRow({
          label: "Booking",
          valuePrefix: "",
          selected: 0,
          options: ["Review if sore spots", "No review needed unless concerns", "Other"],
          customOptionIndex: 2,
          customPlaceholder: "Enter next visit"
        }))
      ]
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
          label: WORDING_STANDARD.labels.sigMedHx,
          valuePrefix: `${WORDING_STANDARD.labels.sigMedHx}: `,
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
        {
          type: "choice_text",
          label: "C/O",
          valuePrefix: "C/O: ",
          selected: 0,
          options: [WORDING_STANDARD.terms.nil, "Pain", "Sensitivity", "Chipped tooth", WORDING_STANDARD.terms.other],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter complaint"
        },
        ...createPainAssessmentRows({ complaintLabel: "C/O", includeSensitivitySite: true }),
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
    {
      id: "next-visit",
      title: "Next Visit",
      included: true,
      rows: [
        { type: "choice", label: "Timing", valuePrefix: "", selected: 0, options: ["6 monthly clean 20mins", "recall for initial clean", "review 15mins", "review 30mins"] }
      ]
    }
  ];
}

function createNewPatientTemplateSections() {
  return [
    {
      id: "npe-attendance",
      title: "Exam and Clean",
      hideTitle: true,
      included: true,
      rows: [
        {
          type: "choice",
          label: "Exam Type",
          valuePrefix: "",
          selected: 0,
          required: true,
          deletable: false,
          options: ["RFA: New Patient Exam and Clean", "RFA: Recall Exam and Clean"],
          modeValues: ["New", "Recall"]
        },
        { type: "choice_text", label: "C/O", valuePrefix: "C/O: ", selected: 0, options: OPTION_SETS.nilPainSensitivityOther, customOptionIndex: 3, customValue: "", customPlaceholder: "Enter complaint" },
        ...createPainAssessmentRows({ complaintLabel: "C/O", includeSensitivitySite: true, showIfExamType: "New" })
      ]
    },
    {
      id: "medical-history",
      title: "Medical History",
      included: true,
      rows: [
        { type: "line", text: "Form filled and signed - See scanned sheet", showIfExamType: "New" },
        { type: "line", text: "Form filled and signed - See section", showIfExamType: "Recall" },
        {
          type: "choice_text",
          label: "MH update",
          valuePrefix: "Changes to MH: ",
          selected: 0,
          options: ["No changes to MH", "Changes to MH"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter medical history changes",
          showIfExamType: "Recall"
        },
        { type: "choice_text", label: "Allergies", valuePrefix: "Allergies: ", selected: 0, options: ["No relevant allergies", "Allergic to penicillin", "Other"], customOptionIndex: 2, customValue: "", customPlaceholder: "Enter allergies", showIfExamType: "New" },
        { type: "choice_text", label: "Medication", valuePrefix: "Medication: ", selected: 0, options: ["No relevant medication", "Other"], customOptionIndex: 1, customValue: "", customPlaceholder: "Enter medications", showIfExamType: "New" },
        { type: "choice_text", label: "Conditions", valuePrefix: "Conditions: ", selected: 0, options: ["No relevant conditions", "Other"], customOptionIndex: 1, customValue: "", customPlaceholder: "Enter medical conditions", showIfExamType: "New" },
        {
          type: "multi_choice",
          label: "Major implications",
          valuePrefix: "Major implications: ",
          selected: [],
          bold: true,
          showIfExamType: "New",
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
      showIfExamType: "New",
      rows: [
        { type: "choice", label: "Anxious of dental visits", valuePrefix: "Anxious of dental visits: ", selected: -1, options: OPTION_SETS.yesNo },
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
        { type: "choice_text", label: "LN, MOM, SG, TMJ", valuePrefix: "LN, MOM, SG, TMJ: ", selected: 0, options: OPTION_SETS.nilOther, customOptionIndex: 1, customValue: "", customPlaceholder: "Enter findings" },
        { type: "choice_text", label: "Soft tissues", valuePrefix: "Soft tissues: ", selected: 0, options: OPTION_SETS.nilOther, customOptionIndex: 1, customValue: "", customPlaceholder: "Enter soft tissue findings" }
      ]
    },
    {
      id: "dental-exam",
      title: "Dental Exam",
      included: true,
      rows: [
        { type: "choice_text", label: "PSR", valuePrefix: "PSR: ", selected: -1, options: ["000000", "000020", "111121", "212222", "222222", "333333", "323222", "111111", "Other"], customOptionIndex: 8, customValue: "", customPlaceholder: "Enter PSR" },
        { type: "choice_text", label: "Gingivae", valuePrefix: "Gingivae: ", selected: -1, options: ["Healthy", "Generalised inflammation", "Localised inflammation", "Other"], customOptionIndex: 3, customValue: "", customPlaceholder: "Enter gingival finding" },
        { type: "choice", label: "Plaque deposits", valuePrefix: "Plaque deposits: ", selected: -1, options: OPTION_SETS.nilMildModerateSevere },
        { type: "choice_text", label: "Plaque Location", valuePrefix: "Plaque location: ", selected: -1, options: ["Nil", "Generalised", "Lower Anteriors", "Posterior Uppers", "Posterior Lowers", "Posteriors", "Gumline", "Linguals/Palatals", "Generalised staining", "Other"], customOptionIndex: 9, customValue: "", customPlaceholder: "Enter plaque location" },
        { type: "choice", label: "Calculus deposits", valuePrefix: "Calculus deposits: ", selected: -1, options: OPTION_SETS.nilMildModerateSevere },
        { type: "choice_text", label: "Calculus Location", valuePrefix: "Calculus location: ", selected: -1, options: ["Nil", "Generalised", "Lower Anteriors", "Posterior Uppers", "Posterior Lowers", "Posteriors", "Other"], customOptionIndex: 6, customValue: "", customPlaceholder: "Enter calculus location" },
        { type: "choice", label: "Oral Hygiene", valuePrefix: "Oral hygiene: ", selected: -1, options: ["Poor", "Fair", "Good", "Excellent"] },
        { type: "tooth_picker", label: "Caries", valuePrefix: "Caries: ", selectedMode: "nil", entries: [], nilOptionLabel: "Nil", selectOptionLabel: "Select teeth/surfaces", includeSurfaces: true },
        {
          type: "tooth_picker",
          label: "Leaking or defective restorations",
          valuePrefix: "Leaking or defective restorations: ",
          selectedMode: "nil",
          entries: [],
          nilOptionLabel: "Nil",
          selectOptionLabel: "Select teeth/surfaces",
          includeSurfaces: true
        },
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
      rows: createRadiographRows({
        bwsNotIndicatedOption: "None indicated today",
        bwsDeclinedOption: "Patient declined bitewings - understands exam is not complete without radiographs",
        cariesAsAboveOption: "As above",
        cariesNilOption: "Nil",
        pasNoneIndicatedOption: "None indicated today",
        pasTakenOption: "Taken to assess for PAP, bone levels, caries, and root morphology"
      })
    },
    {
      id: "opg",
      title: "OPG",
      included: true,
      rows: [
        { type: "choice_text", label: "Indication for OPG", valuePrefix: "Indication for OPG: ", selected: -1, options: ["General Screening", "Patient Request", "Periodontal Screening", "Wisdom teeth", "Pain Assessment", "Treatment planning", "Other"], customOptionIndex: 6, customValue: "", customPlaceholder: "Enter indication" },
        { type: "tooth_picker", label: "Caries", valuePrefix: "Caries: ", selectedMode: "nil", entries: [], includeSurfaces: true },
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
        {
          type: "multi_choice",
          label: "Modifying factor",
          valuePrefix: "Modifying factor: ",
          selected: [],
          options: [
            "Family history",
            "Diabetes",
            "Smoking"
          ]
        }
      ]
    },
    {
      id: "risk-assessment",
      title: "Risk assessment",
      included: true,
      showIfExamType: "New",
      rows: [
        { type: "choice", label: "Caries", valuePrefix: "Caries risk: ", selected: -1, options: ["Low", "Medium", "High"] },
        { type: "choice", label: "Periodontal", valuePrefix: "Periodontal risk: ", selected: -1, options: ["Low", "Medium", "High"] },
        { type: "choice", label: "Oral Cancer", valuePrefix: "Oral cancer risk: ", selected: -1, options: ["Low", "Medium", "High"] }
      ]
    },
    {
      id: "tx-plan",
      title: "THIS VISIT",
      included: true,
      rows: [
        {
          type: "multi_choice",
          label: "This visit treatment",
          valuePrefix: "",
          selected: [0, 1, 2],
          options: [
            "S/C completed with US.",
            "Teeth polished with prophy paste.",
            "Topical Fluoride 9000ppm applied on teeth and POIG."
          ]
        },
        {
          type: "multi_choice",
          label: "OHI",
          valuePrefix: "OHI: ",
          selected: [0],
          options: [
            "Encouraged to keep up OH habits",
            "Brush twice daily",
            "Brush near gumline",
            "Brush the back teeth thoroughly",
            "Brush inside surfaces of teeth",
            "Floss daily",
            "Modified Bass technique video shown"
          ]
        }
      ]
    },
    createRestorationsSection("Restorations"),
    {
      id: "next-visit",
      title: "Next Visit",
      included: true,
      rows: [
        createNextVisitChoiceRow({
          label: "Booking",
          valuePrefix: "",
          selected: 0,
          options: ["Recall 6 months 20 mins for periodic checkup and s/c", "Book appt 1 week, 1hr for restos", "Book appt 1 week, 30mins for restos", "Other"],
          customOptionIndex: 3,
          customPlaceholder: "Enter next visit plan"
        })
      ]
    }
  ];
}

function createChildExamTemplateSections() {
  return [
    {
      id: "child-exam-rfa",
      title: "Child Exam",
      included: true,
      rows: [
        {
          type: "choice",
          label: "Exam Type",
          valuePrefix: "",
          selected: 0,
          required: true,
          deletable: false,
          options: ["RFA: Child New Exam and Clean", "RFA: Child Recall Exam and Clean"],
          modeValues: ["New", "Recall"]
        },
        {
          type: "choice",
          label: "Age Band",
          valuePrefix: "Age band: ",
          selected: 0,
          required: true,
          deletable: false,
          options: ["0-6", "6-8", "9-12", "12-18"],
          modeValues: ["0-6", "6-8", "9-12", "12-18"]
        },
        {
          type: "choice_text",
          label: WORDING_STANDARD.labels.attendingWith,
          valuePrefix: `${WORDING_STANDARD.labels.attendingWith}: `,
          selected: 0,
          options: ["Mum", "Dad", "Mum and Dad", "Alone", "Brother", "Sister", "Grandma", WORDING_STANDARD.terms.other],
          customOptionIndex: 7,
          customValue: "",
          customPlaceholder: "Enter attending with detail"
        },
        { type: "choice", label: "Co-operation", valuePrefix: "Co-operation: ", selected: 1, options: ["Poor", "Good", "Excellent", "Fair", "Good, anxious but cooperative with positive reinforcement"] },
        { type: "choice_text", label: "C/O", valuePrefix: "C/O: ", selected: 0, options: OPTION_SETS.nilPainSensitivityOther, customOptionIndex: 3, customValue: "", customPlaceholder: "Enter complaint" }
      ]
    },
    {
      id: "child-medical-history",
      title: "Medical History",
      included: true,
      rows: [
        { type: "line", text: "Form filled and signed - See scanned sheet", showIfExamType: "New" },
        { type: "line", text: "Form filled and signed - See section", showIfExamType: "Recall" },
        { type: "choice_text", label: "MH update", valuePrefix: "Changes to MH: ", selected: 0, options: ["No changes to MH", "Changes to MH"], customOptionIndex: 1, customValue: "", customPlaceholder: "Enter medical history changes", showIfExamType: "Recall" },
        { type: "choice_text", label: "Allergies", valuePrefix: "Allergies: ", selected: 0, options: ["No relevant allergies", "Allergic to penicillin", "Other"], customOptionIndex: 2, customValue: "", customPlaceholder: "Enter allergies", showIfExamType: "New" },
        { type: "choice_text", label: "Medication", valuePrefix: "Medication: ", selected: 0, options: ["No relevant medication", "Medication: Ventolin", "Medication: Melatonin", "Other"], customOptionIndex: 3, customValue: "", customPlaceholder: "Enter medication", showIfExamType: "New" },
        { type: "choice_text", label: "Conditions", valuePrefix: "Conditions: ", selected: 0, options: ["No relevant conditions", "Conditions: Asthma", "Conditions: ASD", "Conditions: ADHD", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter conditions", showIfExamType: "New" }
      ]
    },
    {
      id: "child-social-dental",
      title: "Social and Dental History",
      included: true,
      rows: [
        { type: "line", text: "SHx:" },
        { type: "choice", label: "Last check up", valuePrefix: "Last check up: ", selected: 0, options: ["First Time", "3m", "6m", "9m", "12m", "18m", "24m", ">2yrs", "First Time at dentist for checkup"] },
        { type: "choice", label: "Sugars in diet", valuePrefix: "Sugars in diet: ", selected: -1, options: ["Low", "Medium", "High"] },
        { type: "choice_text", label: "Brushing", valuePrefix: "Brushing: ", selected: 0, options: ["Once", "Twice", "Self", "Assisted", "Supervised", "less than once", "Other"], customOptionIndex: 6, customValue: "", customPlaceholder: "Enter brushing detail" },
        { type: "choice", label: "Intake after night time brushing", valuePrefix: "Intake after night time brushing: ", selected: 0, options: ["Nil", "Milk", "Snack"], showIfAgeBand: "0-6" },
        { type: "choice", label: "Intake after night time brushing", valuePrefix: "Intake after night time brushing: ", selected: 0, options: ["Nil", "Milk", "Snack"], showIfAgeBand: "6-8" }
      ]
    },
    {
      id: "child-tissue-exam",
      title: "Tissue Exam",
      included: true,
      rows: [
        { type: "choice_text", label: "E/O (LN,MOM,SG,TMJ)", valuePrefix: "E/O (LN,MOM,SG,TMJ): ", selected: 0, options: OPTION_SETS.nilOther, customOptionIndex: 1, customValue: "", customPlaceholder: "Enter E/O findings" },
        { type: "choice_text", label: "I/O (Tongue,FOM, palate, mucosa)", valuePrefix: "I/O (Tongue,FOM, palate, mucosa): ", selected: 0, options: ["Nil", "PRR", "Other"], customOptionIndex: 2, customValue: "", customPlaceholder: "Enter I/O findings" },
        { type: "choice", label: "Gingivae", valuePrefix: "Gingivae: ", selected: 0, options: ["Healthy", "Inflamed"] }
      ]
    },
    {
      id: "child-intra-oral-exam",
      title: "Intra Oral Exam",
      included: true,
      rows: [
        { type: "choice_text", label: "Teeth present", valuePrefix: "Teeth present: ", selected: 0, options: ["All deciduous teeth", "Mixed dentition", "Adult teeth present", "Other"], customOptionIndex: 3, customValue: "", customPlaceholder: "Enter dentition detail" },
        { type: "tooth_picker", label: "Adult Teeth present", valuePrefix: "Adult Teeth present: ", selectedMode: "nil", entries: [], showIfAgeBand: "6-8" },
        { type: "tooth_picker", label: "Adult Teeth present", valuePrefix: "Adult Teeth present: ", selectedMode: "nil", entries: [], showIfAgeBand: "9-12" },
        { type: "tooth_picker", label: "Adult Teeth present", valuePrefix: "Adult Teeth present: ", selectedMode: "nil", entries: [], showIfAgeBand: "12-18" },
        { type: "choice_text", label: "Adult Canines", valuePrefix: "Adult Canines: ", selected: -1, options: ["Palpable", "Erupted", "Missing", "Other"], customOptionIndex: 3, customValue: "", customPlaceholder: "Enter canine status", showIfAgeBand: "9-12" },
        { type: "choice_text", label: "Adult Canines", valuePrefix: "Adult Canines: ", selected: -1, options: ["Palpable", "Erupted", "Missing", "Other"], customOptionIndex: 3, customValue: "", customPlaceholder: "Enter canine status", showIfAgeBand: "12-18" },
        { type: "choice", label: "Oral Hygiene", valuePrefix: "Oral Hygiene: ", selected: -1, options: ["Poor", "Fair", "Good", "Excellent"] },
        { type: "choice", label: "Plaque deposits", valuePrefix: "Plaque deposits: ", selected: -1, options: OPTION_SETS.nilMildModerateSevere },
        { type: "choice_text", label: "Plaque Location", valuePrefix: "Plaque Location: ", selected: -1, options: ["Nil", "Generalised", "Lower Anteriors", "Posterior Uppers", "Posterior Lowers", "Posteriors", "Gumline", "Generalised staining", "Other"], customOptionIndex: 8, customValue: "", customPlaceholder: "Enter plaque location" },
        { type: "choice", label: "Calculus deposits", valuePrefix: "Calculus deposits: ", selected: -1, options: OPTION_SETS.nilMildModerateSevere },
        { type: "choice_text", label: "Calculus Location", valuePrefix: "Calculus Location: ", selected: -1, options: ["Nil", "Generalised", "Lower Anteriors", "Posterior Uppers", "Posterior Lowers", "Posteriors", "Lowers", "Other"], customOptionIndex: 7, customValue: "", customPlaceholder: "Enter calculus location" },
        { type: "choice_text", label: "Crowding", valuePrefix: "Crowding: ", selected: -1, options: ["Nil", "Mild at", "Moderate at", "Severe at", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter crowding detail", showIfAgeBand: "9-12" },
        { type: "choice_text", label: "Crowding", valuePrefix: "Crowding: ", selected: -1, options: ["Nil", "Mild at", "Moderate at", "Severe at", "Nil - upper and lower fixed retainers, and wearing retainers at night", "Other"], customOptionIndex: 5, customValue: "", customPlaceholder: "Enter crowding detail", showIfAgeBand: "12-18" },
        { type: "text", label: "Overjet", prefix: "Overjet: ", value: "", placeholder: "Enter overjet", showIfAgeBand: "9-12" },
        { type: "text", label: "Overjet", prefix: "Overjet: ", value: "", placeholder: "Enter overjet", showIfAgeBand: "12-18" },
        { type: "text", label: "Overbite", prefix: "Overbite: ", value: "", placeholder: "Enter overbite", showIfAgeBand: "9-12" },
        { type: "text", label: "Overbite", prefix: "Overbite: ", value: "", placeholder: "Enter overbite", showIfAgeBand: "12-18" },
        { type: "choice_text", label: "Occlusion", valuePrefix: "Occlusion: ", selected: -1, options: ["1/4 Unit", "1/2 Unit", "1 Unit", ">1 Unit", "Class 1 RHS", "Class 2 RHS", "Class 3 RHS", "Class 1 LHS", "Class 2 LHS", "Class 3 LHS", "Other"], customOptionIndex: 10, customValue: "", customPlaceholder: "Enter occlusion detail", showIfAgeBand: "9-12" },
        { type: "choice_text", label: "Occlusion", valuePrefix: "Occlusion: ", selected: -1, options: ["1/4 Unit", "1/2 Unit", "1 Unit", ">1 Unit", "Class 1 RHS", "Class 2 RHS", "Class 3 RHS", "Class 1 LHS", "Class 2 LHS", "Class 3 LHS", "Other"], customOptionIndex: 10, customValue: "", customPlaceholder: "Enter occlusion detail", showIfAgeBand: "12-18" },
        { type: "choice_text", label: "Ortho referral", valuePrefix: "Ortho referral: ", selected: -1, options: ["Yes", "No", "No, pt did not want referral", "Not at this stage", "No, pt already had early phase tx, waiting for eruption of adult teeth to start braces", "No, pt is already seeing orthodontist", "No, pt has braces on", "Other"], customOptionIndex: 7, customValue: "", customPlaceholder: "Enter ortho referral detail", showIfAgeBand: "9-12" },
        { type: "choice_text", label: "Ortho referral", valuePrefix: "Ortho referral: ", selected: -1, options: ["Yes", "No", "No, pt did not want referral", "Pt is already seeing orthodontist", "No, already completed ortho", "Pt is already seeing orthodontist - has fixed appliances atm", "Other"], customOptionIndex: 6, customValue: "", customPlaceholder: "Enter ortho referral detail", showIfAgeBand: "12-18" },
        { type: "tooth_picker", label: "Caries", valuePrefix: "Caries: ", selectedMode: "nil", entries: [], includeSurfaces: true },
        { type: "choice", label: "Caries Risk", valuePrefix: "Caries Risk: ", selected: -1, options: ["Low", "Med", "High"] }
      ]
    },
    {
      id: "child-radiographs",
      title: "Radiographs",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: WORDING_STANDARD.labels.bws,
          valuePrefix: "",
          selected: 0,
          options: [
            WORDING_STANDARD.terms.noneIndicatedToday,
            BWS_TAKEN_OPTION,
            WORDING_STANDARD.radiographs.bwsDeclinedExamIncomplete,
            WORDING_STANDARD.radiographs.bwsUnableExamIncomplete,
            WORDING_STANDARD.terms.other
          ],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter radiograph detail"
        }
      ]
    },
    {
      id: "child-tx",
      title: "Tx",
      included: true,
      rows: [
        { type: "choice_text", label: "OHI reinforced", valuePrefix: "OHI reinforced: ", selected: -1, options: OPTION_SETS.yesNoOther, customOptionIndex: 2, customValue: "", customPlaceholder: "Enter OHI detail" },
        { type: "line", text: "Dietary advice: Minimise sugar intake, keep snacks near mealtime, avoid food after brushing" },
        { type: "choice_text", label: "Treatment done", valuePrefix: "", selected: 0, options: ["S/C completed with US. Teeth polished with prophy paste. Topical fluoride.", "Clean completed with prophy paste. Tooth mousse plus. POIG.", "S/C completed with US. Teeth polished with prophy paste. Topical tooth mousse plus.", "S/C completed with US. Topical Fluoride.", "Other"], customOptionIndex: 4, customValue: "", customPlaceholder: "Enter treatment detail" }
      ]
    },
    {
      id: "child-fissure-sealants",
      title: "Fissure Sealants",
      included: true,
      showIfExamType: "New",
      rows: [
        { type: "line", text: "xx Deep pits and fissures" },
        { type: "line", text: "Tooth isolated with cotton rolls" },
        { type: "line", text: "Prepped with pumice, 37% Phosphoric Acid Etch" },
        { type: "line", text: "Scotchbond placed, dried and cured" },
        { type: "line", text: "Spident Seal It placed and cured" },
        { type: "line", text: "Fissure sealant polished and bite checked and satisfactory" }
      ],
      showIfAgeBand: ["6-8", "9-12"]
    },
    {
      id: "child-nv",
      title: "N/V",
      included: true,
      rows: [
        createNextVisitChoiceRow({
          label: "Booking",
          valuePrefix: "",
          selected: 0,
          options: ["Recall Exam and Clean, 30m, 6months", "Restos, 30mins ASAP", "Recall Exam and Clean, 20m, 6months", "Recall Exam and Clean, 15m, 6months", "Recall Exam and Clean, 10m, 6months", "Restos, 20mins ASAP", "Other"],
          customOptionIndex: 6,
          customPlaceholder: "Enter next visit booking"
        })
      ]
    }
  ];
}

function createFreestyleAppointmentTemplateSections() {
  return [
    {
      id: "freestyle-appointment",
      title: "Freestyle Appointment",
      included: true,
      hideTitle: true,
      rows: [
        { type: "text", label: "RFA", prefix: "RFA: ", value: "", placeholder: "Enter reason for attendance", showEmpty: true, deletable: false },
        { type: "text", label: "PC", prefix: "PC: ", value: "", placeholder: "Enter presenting complaint", showEmpty: true, deletable: false },
        { type: "line", text: "", deletable: false },
        {
          type: "text",
          label: WORDING_STANDARD.labels.oe,
          prefix: `${WORDING_STANDARD.labels.oe}: `,
          value: "",
          placeholder: "Enter objective exam findings",
          showEmpty: true,
          deletable: false
        }
      ]
    }
  ];
}

function createEndodonticsTemplateSections() {
  return [
    {
      id: "endo-pre-op-discussion",
      title: "Pre-op discussion",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Med Hx",
          valuePrefix: "",
          selected: 0,
          options: [
            "Recent Med Hx - Checked and unchanged",
            "Nil Sig Med Hx",
            "Sig Med Hx: Diabetes",
            "Sig Med Hx (enter details)"
          ],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter significant medical history"
        },
        { type: "tooth_picker", label: "Tooth to be treated", valuePrefix: "Tooth to be treated: ", selectedMode: "nil", entries: [] },
        {
          type: "choice_text",
          label: "Pre-operative symptoms",
          valuePrefix: "Pre-operative symptoms: ",
          selected: 0,
          options: ["Nil", "Tenderness on biting", "Sensitivity to hot or cold", "Patient had large swelling", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter symptom detail"
        },
        { type: "line", text: "Procedure and prognosis discussed with patient as per consultation. Risks, benefits and alternatives explained." },
        { type: "line", text: "Outlined length of the procedure and possible need for multiple visits depending on clinical scenario." },
        { type: "line", text: "Confirmed that pt has no further questions prior to commencing procedure" },
        { type: "line", text: "Happy to proceed with treatment today" }
      ]
    },
    {
      id: "endo-pre-op-radiograph",
      title: "Pre op radiograph",
      included: true,
      rows: [
        { type: "line", text: "Pre op PA radiograph to assess" },
        {
          type: "choice_text",
          label: "Report",
          valuePrefix: "Report: ",
          selected: 0,
          options: ["Associated PARL", "Caries -", "Other"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter report detail"
        }
      ]
    },
    {
      id: "endo-la",
      title: "LA",
      included: true,
      rows: createLocalAnaestheticRows({
        methodLabel: "Technique",
        methodValuePrefix: "Technique: "
      })
    },
    {
      id: "endo-access",
      title: "Access",
      included: true,
      rows: [
        {
          type: "choice",
          label: "Isolation",
          valuePrefix: "",
          selected: 0,
          options: ["Single tooth isolation with dental dam", "Multiple tooth isolation with dental dam"]
        },
        { type: "line", text: "Opened and accessed canal system" },
        {
          type: "choice_text",
          label: "Hand files to establish glide path. K-files size",
          valuePrefix: "Hand files to establish glide path. K-files size: ",
          selected: 0,
          options: ["10", "10 and 15", "10, 15 and 20", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter K-file sizes"
        }
      ]
    },
    {
      id: "endo-canal-length",
      title: "Canal length",
      included: true,
      rows: [
        { type: "line", text: "WL established with EAL (electronic apex locator)" },
        { type: "line", text: "Verified with WL Radiograph" },
        { type: "text", label: "Lengths", prefix: "Lengths: ", value: "", placeholder: "Enter lengths" }
      ]
    },
    {
      id: "endo-shaping",
      title: "Shaping",
      included: true,
      rows: [{ type: "line", text: "Preparing canal system to above specified lengths up to X2 rotary files" }]
    },
    {
      id: "endo-irrigation",
      title: "Irrigation",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Irrigation solution",
          valuePrefix: "Copious and careful irrigation throughout with ",
          selected: 0,
          options: ["1% NaOCl", "Other"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter irrigation solution"
        },
        { type: "line", text: "EDTA 15% irrigation done followed by 1% NaOCl again" }
      ]
    },
    {
      id: "endo-obturation",
      title: "Obturation",
      included: true,
      rows: [
        { type: "line", text: "Master cone PA radiograph taken to confirm lengths" },
        {
          type: "choice_text",
          label: "Report",
          valuePrefix: "Report: ",
          selected: 0,
          options: ["All sound for obturation", "Other"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter obturation report"
        },
        { type: "line", text: "Dried canals completely with matched PP" },
        {
          type: "choice_text",
          label: "Obturation material",
          valuePrefix: "",
          selected: 0,
          options: ["Obturated with Protaper system using matched customised GP points and AH+ sealer", "Other"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter obturation material and sealer"
        }
      ]
    },
    {
      id: "endo-post-op-radiograph",
      title: "Post op radiograph",
      included: true,
      rows: [
        { type: "line", text: "Post op PA radiograph to assess" },
        {
          type: "choice_text",
          label: "Report",
          valuePrefix: "Report: ",
          selected: 0,
          options: ["Length and condensation satisfactory", "Other"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter report detail"
        }
      ]
    },
    {
      id: "endo-sealing",
      title: "Sealing",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Intracanal medicament",
          valuePrefix: "",
          selected: 0,
          options: ["Odontopaste in canals with size 8 file", "CaOH in canals with size 8 file", "Ledermix in canals with size 8 file", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter intracanal medicament"
        },
        { type: "line", text: "Cavit placed over chamber" },
        {
          type: "choice_text",
          label: "Restoration",
          valuePrefix: "",
          selected: 0,
          options: ["Etch, bond. Restored with A2 CR", "Dentine conditioner, restored with Fuji VII pink", "Dentine conditioner, restored with Fuji 2 LC", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter restoration material"
        },
        { type: "line", text: "Restoration polished and bite checked" }
      ]
    },
    {
      id: "endo-post-op-discussion",
      title: "Post op discussion",
      included: true,
      rows: [
        {
          type: "line",
          text: "Advised we have agitated an area of infection, and some pain or discomfort after the appointment is normal. Take Panadol/Nurofen as needed. If swelling comes up or any large issues please contact us."
        },
        createNextVisitChoiceRow({
          selected: -1,
          options: ["Chemomech", "Obturation", "Crown prep", "Exam/clean", "30m", "40m", "45m", "60m", "75m", WORDING_STANDARD.terms.other],
          customOptionIndex: 9,
          customPlaceholder: "Enter next visit detail"
        })
      ]
    }
  ];
}

function createExtractionAdultTemplateSections() {
  return [
    {
      id: "exo-adult-rfa",
      title: WORDING_STANDARD.labels.rfaEmergencyAppt,
      included: true,
      rows: [
        {
          type: "choice_text",
          label: WORDING_STANDARD.labels.sigMedHx,
          valuePrefix: `${WORDING_STANDARD.labels.sigMedHx}: `,
          selected: 0,
          options: OPTION_SETS.nilOther,
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter significant medical history"
        },
        {
          type: "choice",
          label: WORDING_STANDARD.labels.attendingWith,
          valuePrefix: `${WORDING_STANDARD.labels.attendingWith}: `,
          selected: 0,
          options: ["Alone", "Mum", "Dad", "Mum and Dad", "Friend", "Brother", "Sister", "Carer", "Partner", "Carer - son", "Carer - daughter"]
        },
        {
          type: "choice_text",
          label: WORDING_STANDARD.labels.pcHx,
          valuePrefix: `${WORDING_STANDARD.labels.pcHx}: `,
          selected: 0,
          options: [WORDING_STANDARD.terms.nil, "Pain", "Sensitivity", "Sharpness to tongue", "Mobility", WORDING_STANDARD.terms.other],
          customOptionIndex: 5,
          customValue: "",
          customPlaceholder: "Enter presenting complaint"
        },
        { type: "text", label: "PC detail", prefix: "PC: ", value: "", placeholder: "Enter notes" },
        { type: "text", label: WORDING_STANDARD.labels.oe, prefix: `${WORDING_STANDARD.labels.oe}: `, value: "", placeholder: "Enter OE findings" },
        {
          type: "choice_text",
          label: "PA",
          valuePrefix: "PA: ",
          selected: 0,
          options: ["PA taken", "PA not indicated", "Other"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter radiograph detail"
        },
        {
          type: "choice_text",
          label: WORDING_STANDARD.labels.findings,
          valuePrefix: `${WORDING_STANDARD.labels.findings}: `,
          selected: -1,
          options: ["Nil significant findings", "Periapical radiolucency noted", "Deep caries approaching pulp", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter findings"
        },
        { type: "tooth_picker", label: "Dx tooth", valuePrefix: "Dx tooth: ", selectedMode: "nil", entries: [] },
        {
          type: "choice_text",
          label: "Dx",
          valuePrefix: "Dx: ",
          selected: -1,
          options: ["Non-restorable tooth", "Symptomatic tooth with poor prognosis", "Retained root", "Mobility", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter diagnosis"
        },
        { type: "tooth_picker", label: "Tx extraction", valuePrefix: "Tx: Extraction of ", selectedMode: "teeth", entries: [], selectOptionLabel: "Select teeth" },
        {
          type: "choice_text",
          label: "Alternative options",
          valuePrefix: "Alternative options: ",
          selected: -1,
          options: ["Monitor", "RCT + crown", "Referral to specialist", "No treatment", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter alternative options discussed"
        },
        {
          type: "choice_text",
          label: "Plan for the gap",
          valuePrefix: "Plan for the gap: ",
          selected: 0,
          options: [
            "Nil (leave gap)",
            "Implant",
            "Bridge",
            "Ortho",
            "Denture",
            "Orthodontics",
            "Nil (leave gap) for now",
            "Implant, referred to Barkstom Oral Surgery",
            "add to Denture",
            "Other"
          ],
          customOptionIndex: 9,
          customValue: "",
          customPlaceholder: "Enter plan for the gap"
        },
        {
          type: "choice_text",
          label: "Risks given",
          valuePrefix: "Risks given: ",
          selected: 0,
          options: [
            "Pain, bruising, swelling, bleeding",
            "Pain, bruising, swelling, bleeding, dry socket",
            "Pain, bruising, swelling, bleeding, infection",
            "Other"
          ],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter risk discussion"
        }
      ]
    },
    {
      id: "exo-adult-consent",
      title: "Consent",
      included: true,
      rows: createStructuredConsentRows({
        optionsDiscussedChoices: [
          "Proceed with extraction today",
          "No treatment/monitoring discussed",
          "RCT + crown discussed",
          "Referral to specialist discussed",
          WORDING_STANDARD.terms.other
        ]
      })
    },
    {
      id: "exo-adult-la",
      title: "LA",
      included: true,
      rows: createLocalAnaestheticRows({
        methodLabel: "LA method",
        methodValuePrefix: "LA: ",
        methodOptions: OPTION_SETS.laMethodIdb
      })
    },
    {
      id: "exo-adult-treatment",
      title: "Treatment",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Exo completed with",
          valuePrefix: "Exo completed with: ",
          selected: 0,
          options: ["Luxator", "Luxator and forceps", "Forceps", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter instruments used"
        },
        {
          type: "choice_text",
          label: "Extraction type",
          valuePrefix: "",
          selected: 0,
          options: ["Uneventful exo", "Surgical extraction: sectioned roots delivered whole", "Other"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter extraction detail"
        },
        {
          type: "choice_text",
          label: "Apices intact and seen",
          valuePrefix: "Apices intact and seen: ",
          selected: 0,
          options: OPTION_SETS.yesNoOther,
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter apex detail"
        },
        {
          type: "line",
          text: "Post op instructions given: no rinsing for 24 hours, swallow saliva, bite on pack if bleeding, painkillers, avoid hot drinks, salt water rinses from 24 hours onwards; contact if persistent issues. Post operative numbness warning given. Pt advised to avoid chewing or hot food/drink until numbness has worn off."
        },
        {
          type: "choice_text",
          label: "Post op sheet",
          valuePrefix: "Post op sheet: ",
          selected: 0,
          options: ["Given with bite pack information", "Given verbally only", "Other"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter post op information provided"
        },
        ...createMedicationAndAdverseEventRows(),
        { type: "line", text: WORDING_STANDARD.phrases.patientSatisfiedOnDeparture },
        createNextVisitChoiceRow({
          selected: 0,
          options: ["Recall Exam 30mins", "Initial Exam 30mins", "Initial Exam 45mins", "Initial Exam 40mins", "Initial Exam 15mins", WORDING_STANDARD.terms.other],
          customOptionIndex: 5,
          customPlaceholder: "Enter next visit plan"
        })
      ]
    }
  ];
}

function createExtractionChildTemplateSections() {
  return [
    {
      id: "exo-child-rfa",
      title: "RFA: Extraction",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: WORDING_STANDARD.labels.sigMedHx,
          valuePrefix: `${WORDING_STANDARD.labels.sigMedHx}: `,
          selected: 0,
          options: OPTION_SETS.nilOther,
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter significant medical history"
        },
        {
          type: "choice",
          label: WORDING_STANDARD.labels.attendingWith,
          valuePrefix: `${WORDING_STANDARD.labels.attendingWith}: `,
          selected: 1,
          options: ["Alone", "Mum", "Dad", "Mum and Dad", "Friend", "Brother", "Sister", "Carer", "Partner", "Carer - son"]
        },
        {
          type: "choice_text",
          label: "PC",
          valuePrefix: "PC: ",
          selected: 0,
          options: ["wobbly baby tooth annoying pt", "adult tooth growing lingually", "adult tooth growing palatally", "adult tooth growing labially", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter presenting complaint"
        },
        { type: "tooth_picker", label: "Pointing at", valuePrefix: "Pointing at: ", selectedMode: "nil", entries: [] },
        { type: "text", label: "PC detail", prefix: "", value: "", placeholder: "Enter additional complaint detail" },
        { type: "text", label: WORDING_STANDARD.labels.oe, prefix: `${WORDING_STANDARD.labels.oe}: `, value: "wobbly baby tooth", placeholder: "Enter OE findings" },
        {
          type: "choice_text",
          label: "PA",
          valuePrefix: "",
          selected: 0,
          options: ["PA taken to check. Findings:", "Nil xray required", "Other"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter PA detail"
        },
        {
          type: "choice_text",
          label: "PA findings",
          valuePrefix: "Findings: ",
          selected: -1,
          options: ["Erupting permanent successor", "Resorption of roots", "No pathology noted", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter PA findings",
          showIf: { label: "PA", equals: "PA taken to check. Findings:" }
        },
        { type: "tooth_picker", label: "Tx extraction", valuePrefix: "Tx: Extraction of ", selectedMode: "teeth", entries: [], selectOptionLabel: "Select teeth" },
        {
          type: "choice_text",
          label: "Risks given",
          valuePrefix: "Risks given: ",
          selected: 0,
          options: ["Pain, bruising, swelling, bleeding", "Pain, bruising, swelling, bleeding, infection", "Other"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter risk discussion"
        }
      ]
    },
    {
      id: "exo-child-consent",
      title: "Consent",
      included: true,
      rows: createStructuredConsentRows({
        optionsDiscussedChoices: [
          "Proceed with extraction today",
          "No treatment/monitoring discussed",
          "Referral to specialist discussed",
          "Discussed with patient and carer",
          WORDING_STANDARD.terms.other
        ]
      })
    },
    {
      id: "exo-child-la",
      title: "LA",
      included: true,
      rows: createLocalAnaestheticRows({
        topicalOptions: ["10% topical xylocaine applied", WORDING_STANDARD.la.noTopicalRequired],
        methodLabel: "LA used",
        methodValuePrefix: "LA: ",
        methodOptions: [
          "no LA required",
          "0.5mL 2% 1:80k adr lidocaine via infils",
          "1mL 2.2mL 2% 1:80k adr lidocaine via infils",
          "2.2mL 2% 1:80k adr lidocaine via infils",
          WORDING_STANDARD.terms.other
        ],
        methodCustomOptionIndex: 4,
        methodCustomPlaceholder: "Enter LA detail",
        includeSitePicker: false,
        includeAgentAndVolume: false
      })
    },
    {
      id: "exo-child-treatment",
      title: "Treatment",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Exo completed with",
          valuePrefix: "Exo completed with: ",
          selected: 0,
          options: ["Luxator", "Luxator and forceps", "Forceps", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter instruments used"
        },
        {
          type: "choice_text",
          label: "Extraction type",
          valuePrefix: "",
          selected: 0,
          options: ["Uneventful exo", "Surgical extraction", "Other"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter extraction detail"
        },
        {
          type: "line",
          text: "Post op instructions given: no rinsing for 24 hours, swallow saliva, bite on pack if bleeding, painkillers, avoid hot drinks, salt water rinses from 24 hours onwards; contact if persistent issues. Sheet given with bite pack information. Post operative numbness warning given. Pt advised to avoid chewing or hot food/drink until numbness has worn off."
        },
        ...createMedicationAndAdverseEventRows(),
        { type: "line", text: WORDING_STANDARD.phrases.patientSatisfiedOnDeparture },
        createNextVisitChoiceRow({
          selected: 0,
          options: ["Recall Exam 30mins", "Initial Exam 30mins", "Initial Exam 45mins", "Initial Exam 15mins", WORDING_STANDARD.terms.other],
          customOptionIndex: 4,
          customPlaceholder: "Enter next visit plan"
        })
      ]
    }
  ];
}

function createCrownPrepTemplateSections() {
  return [
    {
      id: "crown-prep-appointment",
      title: "Prep appointment",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Appointment type",
          valuePrefix: "Patient attending for ",
          selected: 1,
          options: ["Onlay prep today", "Crown prep today", "Bridge prep today", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter prep appointment type"
        },
        { type: "tooth_picker", label: "Teeth", valuePrefix: "Teeth: ", selectedMode: "nil", entries: [] },
        {
          type: "choice_text",
          label: "Material",
          valuePrefix: "Material: ",
          selected: 0,
          options: ["e.max", "Zirconia", "PFM", "Gold", "Porcelain", "Other"],
          customOptionIndex: 5,
          customValue: "",
          customPlaceholder: "Enter material"
        },
        { type: "text", label: "Nurse", prefix: "Nurse: ", value: "", placeholder: "Enter nurse" },
        { type: "text", label: "Dentist", prefix: "Dentist: ", value: "", placeholder: "Enter dentist" },
        { type: "line", text: "RAD present" },
        { type: "line", text: "Patient aware of need for upkeep of restoration - flossing/tepe brushes and regular recall to prevent secondary decay or failure" },
        {
          type: "choice_text",
          label: "Vitality discussion",
          valuePrefix: "",
          selected: 0,
          options: ["Risk of tooth devitalisation and need for RCT in the future discussed", "Non-vital tooth", "Other"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter vitality discussion"
        }
      ]
    },
    {
      id: "crown-prep-la",
      title: "LA",
      included: true,
      rows: createLocalAnaestheticRows({
        topicalSelected: -1,
        methodLabel: "LA method",
        methodValuePrefix: "LA: ",
        methodOptions: OPTION_SETS.laMethodIanb
      })
    },
    {
      id: "crown-prep-treatment",
      title: "Treatment",
      included: true,
      rows: [
        { type: "line", text: "Tooth prepped" },
        {
          type: "choice_text",
          label: "Photos",
          valuePrefix: "",
          selected: -1,
          options: ["Photos taken", "No photos", "Other"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter photo detail"
        },
        {
          type: "choice_text",
          label: "Shade",
          valuePrefix: "Shade: ",
          selected: -1,
          options: ["A1", "A2", "A3", "B1", "B2", "C2", "D2", "Other"],
          customOptionIndex: 7,
          customValue: "",
          customPlaceholder: "Enter shade"
        },
        {
          type: "choice_text",
          label: "Lab",
          valuePrefix: "Lab: ",
          selected: 0,
          options: ["Digital scan taken", "Putty wash impressions 2 stage", "Other"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter lab detail"
        },
        {
          type: "choice_text",
          label: "Temporised with",
          valuePrefix: "Temporised with: ",
          selected: 0,
          options: ["Acrylic temp from pre-op alginate", "Telio", "Clip", "Composite", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter temporary material"
        },
        { type: "line", text: "Occlusion checked and adjusted" },
        { type: "line", text: "Pt warned that temp may come off, to let us know if it does" },
        { type: "line", text: "Pt aware not to floss around temp filling" },
        { type: "line", text: "TCA for fit" }
      ]
    }
  ];
}

function createCrownFitTemplateSections() {
  return [
    {
      id: "crown-fit-appointment",
      title: "Fit appointment",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Appointment type",
          valuePrefix: "Patient attending for ",
          selected: 1,
          options: ["Onlay fit today", "Crown fit today", "Bridge fit today", "Maryland bridge fit today", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter fit appointment type"
        },
        { type: "tooth_picker", label: "Tooth", valuePrefix: "Tooth: ", selectedMode: "nil", entries: [] },
        {
          type: "choice_text",
          label: "Material",
          valuePrefix: "Material: ",
          selected: 0,
          options: ["e.max", "Zirconia", "PFM", "Gold", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter material"
        },
        {
          type: "choice_text",
          label: "Issues with temp",
          valuePrefix: "Issues with temp: ",
          selected: 0,
          options: ["Nil", "Came off", "Sensitive", "High", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter issue"
        },
        { type: "line", text: "Lab work back and checked on models" }
      ]
    },
    {
      id: "crown-fit-la",
      title: "LA",
      included: true,
      rows: createLocalAnaestheticRows({
        topicalSelected: -1,
        methodLabel: "LA method",
        methodValuePrefix: "LA: ",
        methodOptions: OPTION_SETS.laMethodIanb
      })
    },
    {
      id: "crown-fit-pre-cementation",
      title: "Pre-cementation",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Temp removed",
          valuePrefix: "Temp removed: ",
          selected: 0,
          options: ["Flicked off", "Cut off", "Already off", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter temp removal detail"
        },
        { type: "line", text: "Prep cleaned" },
        {
          type: "choice_text",
          label: "Try-in",
          valuePrefix: "Restoration tried in, adjustments needed: ",
          selected: 0,
          options: OPTION_SETS.nilOther,
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter adjustments"
        },
        {
          type: "choice_text",
          label: "VCG",
          valuePrefix: "Pt happy to cement today (VCG), ",
          selected: 0,
          options: ["shown in mirror", "Other"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter consent detail"
        }
      ]
    },
    {
      id: "crown-fit-cementation",
      title: "Cementation",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Cement",
          valuePrefix: "Cement used: ",
          selected: 0,
          options: ["RelyX Unicem", "FujiCEM", "Panavia V5", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter cement"
        },
        { type: "line", text: "Restoration seated and excess cement removed" },
        { type: "line", text: "Margins and contacts checked" },
        { type: "line", text: "Occlusion checked and adjusted" },
        { type: "line", text: "Post op instructions given" },
        createNextVisitChoiceRow({
          selected: -1,
          options: ["Review 15mins", "Review 30mins", "Routine recall", WORDING_STANDARD.terms.other],
          customOptionIndex: 3,
          customPlaceholder: "Enter next visit"
        })
      ]
    }
  ];
}

function createCrownRecementTemplateSections() {
  return [
    {
      id: "crown-recement-appointment",
      title: "Recement appointment",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Appointment type",
          valuePrefix: "Patient attending for ",
          selected: 1,
          options: ["Onlay recement", "Crown recement", "Bridge recement", "Maryland bridge recement", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter recement appointment type"
        },
        { type: "tooth_picker", label: "Tooth", valuePrefix: "Tooth: ", selectedMode: "nil", entries: [] },
        {
          type: "choice_text",
          label: "Material",
          valuePrefix: "Material: ",
          selected: 0,
          options: ["e.max", "Zirconia", "PFM", "Gold", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter material"
        },
        {
          type: "choice_text",
          label: "Crown status",
          valuePrefix: "Crown status: ",
          selected: 0,
          options: ["Debonded crown brought in", "Loose crown in situ", "Crown came off while eating", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter crown status"
        },
        {
          type: "choice_text",
          label: "Symptoms",
          valuePrefix: "Symptoms: ",
          selected: 0,
          options: ["Nil", "Sensitive", "High occlusion", "Food packing", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter symptom detail"
        }
      ]
    },
    {
      id: "crown-recement-la",
      title: "LA",
      included: true,
      rows: createLocalAnaestheticRows({
        topicalSelected: -1,
        methodLabel: "LA method",
        methodValuePrefix: "LA: ",
        methodOptions: OPTION_SETS.laMethodIanb
      })
    },
    {
      id: "crown-recement-pre-cementation",
      title: "Pre-cementation",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Old cement removed",
          valuePrefix: "Old cement removed: ",
          selected: 0,
          options: ["Yes", "Partially", "Not required", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter old cement removal detail"
        },
        {
          type: "choice_text",
          label: "Prep cleaned",
          valuePrefix: "Prep cleaned: ",
          selected: 0,
          options: ["Yes", "Minimal debris/caries removed", "Other"],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter prep detail"
        },
        {
          type: "choice_text",
          label: "Crown internal cleaned",
          valuePrefix: "Crown internal cleaned: ",
          selected: 0,
          options: ["Pumice", "Air abrasion", "Etch + silane", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter internal cleaning detail"
        },
        {
          type: "choice_text",
          label: "Trial fit",
          valuePrefix: "Trial fit: ",
          selected: 0,
          options: ["Passive fit confirmed", "Minor adjustment needed", "Poor fit - remake advised", "Other"],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter trial fit detail"
        },
        {
          type: "choice_text",
          label: "VCG",
          valuePrefix: "Pt happy to recement today (VCG), ",
          selected: 0,
          options: ["shown in mirror", "Other"],
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter consent detail"
        }
      ]
    },
    {
      id: "crown-recement-cementation",
      title: "Cementation",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "Cement",
          valuePrefix: "Cement used: ",
          selected: 0,
          options: ["RelyX Unicem", "FujiCEM", "Panavia V5", "Temp cement", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter cement"
        },
        { type: "line", text: "Crown seated fully and excess cement removed" },
        { type: "line", text: "Margins and contacts checked" },
        { type: "line", text: "Occlusion checked and adjusted" },
        { type: "line", text: "Post op advice given re debond risk and review if crown loosens again" },
        createNextVisitChoiceRow({
          selected: -1,
          options: ["Review if debonds", "Review 15mins", "Routine recall", WORDING_STANDARD.terms.other],
          customOptionIndex: 3,
          customPlaceholder: "Enter next visit"
        })
      ]
    }
  ];
}

function createPeriodontalTreatmentTemplateSections() {
  const riskFactorLabel = "Risk Factors";
  const sequelaLabel = "Potential sequela of periodontal treatments";

  return [
    {
      id: "perio-treatment",
      title: "Perio Treatment",
      included: true,
      rows: [
        { type: "line", text: "Patient attending for Non surgical hygiene phase therapy" },
        { type: "text", label: "Dentist/hygienist", prefix: "Dentist/hygienist: ", value: "", placeholder: "Enter clinician name" },
        { type: "text", label: "Nurse", prefix: "Nurse: ", value: "", placeholder: "Enter nurse name" },
        {
          type: "choice_text",
          label: "C/O",
          valuePrefix: "C/O: ",
          selected: 0,
          options: OPTION_SETS.nilOther,
          customOptionIndex: 1,
          customValue: "",
          customPlaceholder: "Enter chief complaint"
        },
        { type: "text", label: "MH", prefix: "MH: ", value: "", placeholder: "Enter medical history updates" },
        {
          type: "multi_choice",
          label: riskFactorLabel,
          valuePrefix: "Risk Factors: ",
          selected: [],
          options: ["Smoking", "Diabetes", "Vaping", "Family History", "Diet", "Arthritis", "Disability", "Other"]
        },
        {
          type: "text",
          label: "Risk factor (other)",
          prefix: "Risk factor (other): ",
          value: "",
          placeholder: "Enter other risk factor",
          showIf: { label: riskFactorLabel, includes: "Other" }
        }
      ]
    },
    {
      id: "perio-assessments",
      title: "Assessments",
      included: true,
      rows: [
        { type: "line", text: "6PPC carried out" },
        { type: "choice", label: "Mobility", valuePrefix: "Mobility: ", selected: 0, options: ["Nil", "Noted"] },
        { type: "choice", label: "Furcation involvement", valuePrefix: "Furcation involvement: ", selected: 0, options: ["Nil", "Noted"] },
        { type: "line", text: "Diagnosis made and discussed at exam appointment." }
      ]
    },
    {
      id: "perio-discussion",
      title: "Discussion",
      included: true,
      rows: [
        {
          type: "line",
          text: "Patient advised of smoking related to periodontal disease - increased risk factor (3-7 times) for periodontitis and poorer response to periodontal therapy and increased risk of treatment failure and tooth loss. Patient advised smokers receiving treatment for periodontitis are twice as likely to lose teeth compared with non-smokers. Patient advised stopping smoking will help to improve the outcome of periodontal disease.",
          showIf: { label: riskFactorLabel, includes: "Smoking" },
          showIfGlobal: true
        },
        {
          type: "line",
          text: "Patient advised of diabetes related to periodontal disease and increased risk of developing periodontal disease with poorly controlled blood sugar levels and poorer response to periodontal therapy. Patient advised well controlled diabetics have similar risk to non-diabetic patients. Patient advised stabilising periodontal disease will be influenced by how well controlled their glycaemic levels are.",
          showIf: { label: riskFactorLabel, includes: "Diabetes" },
          showIfGlobal: true
        },
        {
          type: "line",
          text: "Discussed with patient about electronic cigarettes/vaping and oral nicotine - still a risk factor for periodontal disease as nicotine is a vasoconstrictor - encouraged patient to try and reduce and stop and to use it as part of a plan to stop smoking and using nicotine.",
          showIf: { label: riskFactorLabel, includes: "Vaping" },
          showIfGlobal: true
        },
        {
          type: "line",
          text: "Family history discussed in context of periodontal disease risk and need for close long-term maintenance.",
          showIf: { label: riskFactorLabel, includes: "Family History" },
          showIfGlobal: true
        },
        {
          type: "line",
          text: "Diet discussed in relation to periodontal inflammation and caries risk, with advice to reduce high sugar frequency and improve plaque control.",
          showIf: { label: riskFactorLabel, includes: "Diet" },
          showIfGlobal: true
        },
        {
          type: "line",
          text: "Medical co-factors including arthritis discussed, with adjusted oral hygiene strategies to improve plaque control.",
          showIf: { label: riskFactorLabel, includes: "Arthritis" },
          showIfGlobal: true
        },
        {
          type: "line",
          text: "Functional or accessibility factors discussed, with personalised oral hygiene instructions and review planning.",
          showIf: { label: riskFactorLabel, includes: "Disability" },
          showIfGlobal: true
        },
        {
          type: "text",
          label: "Risk discussion (other)",
          prefix: "Other risk discussion: ",
          value: "",
          placeholder: "Enter additional risk discussion",
          showIf: { label: riskFactorLabel, includes: "Other" },
          showIfGlobal: true
        },
        {
          type: "text",
          label: "Discussion notes",
          prefix: "",
          value: "",
          placeholder: "Enter notes here..."
        }
      ]
    },
    {
      id: "perio-plan",
      title: "Plan",
      included: true,
      rows: [
        { type: "line", text: "Patient engagement: First time I have commenced perio management with patient" },
        {
          type: "multi_choice",
          label: sequelaLabel,
          valuePrefix: "Potential sequela of periodontal treatments: ",
          selected: [],
          options: [
            "Increased sensitivity of the exposed root surfaces to hot, cold or sweet food and drinks",
            "Increased susceptibility to root surface decay",
            "Temporary increases in tooth mobility",
            "Recession of the gums and exposure of the root surfaces",
            "Elongation of the teeth",
            "A black triangle appearance and shadowing between the teeth where the dental papilla has been lost. This is irreversible, but if treatment is successful it can be masked.",
            "Other"
          ]
        },
        {
          type: "text",
          label: "Potential sequela (other)",
          prefix: "Potential sequela (other): ",
          value: "",
          placeholder: "Enter other sequela",
          showIf: { label: sequelaLabel, includes: "Other" }
        }
      ]
    },
    {
      id: "perio-la",
      title: "LA",
      included: true,
      rows: createLocalAnaestheticRows({
        includeTopical: false,
        methodLabel: "LA",
        methodValuePrefix: "LA: ",
        methodOptions: OPTION_SETS.laMethodIanb,
        methodCustomOptionIndex: 4,
        methodCustomPlaceholder: "Enter LA details",
        includeSitePicker: false,
        includeAgentAndVolume: false
      })
    },
    {
      id: "perio-treatment-today",
      title: "Treatment Today",
      included: true,
      rows: [
        { type: "line", text: "VCO for tx today" },
        {
          type: "choice_text",
          label: "Treatment completed",
          valuePrefix: "",
          selected: 0,
          options: [
            "Gross supra and subgingival scaling with ultrasonic in all areas with calculus build up",
            "Supra and subgingival scaling and RSD carried out",
            "Patient does not want periodontal treatment or scaling",
            "Other"
          ],
          customOptionIndex: 3,
          customValue: "",
          customPlaceholder: "Enter treatment details"
        },
        {
          type: "text",
          label: "RSD areas",
          prefix: "RSD carried out in: ",
          value: "",
          placeholder: "Enter areas",
          showIf: { label: "Treatment completed", equals: "Supra and subgingival scaling and RSD carried out" }
        }
      ]
    },
    {
      id: "perio-oral-hygiene",
      title: "Oral Hygiene",
      included: true,
      rows: [
        {
          type: "choice_text",
          label: "OHI given regarding",
          valuePrefix: "OHI given regarding: ",
          selected: 0,
          options: ["OHI", "Interdental cleaning", "Smoking cessation", "Diet counselling", "Other"],
          customOptionIndex: 4,
          customValue: "",
          customPlaceholder: "Enter OHI topic"
        },
        { type: "line", text: "Advised patient that they will see their gums bleeding and this is a sign of active disease. With a few weeks of excellent oral hygiene using the methods shown, this bleeding should reduce. Seeing bleeding is your body's way of saying there is plaque retained in that area and improved cleaning is needed." }
      ]
    },
    {
      id: "perio-review-next-visit",
      title: "Review Plan/Next Visit",
      included: true,
      rows: [
        {
          type: "choice",
          label: "Return in",
          valuePrefix: "Return in ",
          selected: 1,
          options: ["3 months to review", "6 months to review", "9 months to review", "12 months to review", "2 weeks for quadrant debridement LHS - 1hr"]
        },
        {
          type: "multi_choice",
          label: "Carry out",
          valuePrefix: "Carry out: ",
          selected: [],
          options: ["Quadrant debridement LHS - 1hr", "Quadrant debridement RHS - 1hr", "Quadrant debridement upper - 1hr", "Quadrant debridement lower - 1hr", "Perio review + OHI", "Maintenance clean", "Other"]
        },
        {
          type: "text",
          label: "Carry out (other)",
          prefix: "Carry out (other): ",
          value: "",
          placeholder: "Enter next visit plan",
          showIf: { label: "Carry out", includes: "Other" }
        },
        {
          type: "text",
          label: "Review notes",
          prefix: "",
          value: "",
          placeholder: "Enter notes here..."
        }
      ]
    }
  ];
}

function createPeriodontalEmergencyTemplateSections() {
  return [
    {
      id: "perio-emergency-rfa",
      title: WORDING_STANDARD.labels.rfaEmergencyAppt,
      included: true,
      rows: [
        {
          type: "text",
          label: WORDING_STANDARD.labels.sigMedHx,
          prefix: `${WORDING_STANDARD.labels.sigMedHx}: `,
          value: "",
          placeholder: "Enter notes"
        },
        {
          type: "choice_text",
          label: WORDING_STANDARD.labels.attendingWith,
          valuePrefix: `${WORDING_STANDARD.labels.attendingWith}: `,
          selected: -1,
          options: ["Alone", "Mum", "Dad", "Mum and Dad", "Friend", "Brother", "Sister", "Carer", "Partner", WORDING_STANDARD.terms.other],
          customOptionIndex: 9,
          customValue: "",
          customPlaceholder: "Enter accompanying person"
        },
        {
          type: "text",
          label: "PC",
          prefix: "PC: ",
          value: "",
          placeholder: "Enter presenting complaint"
        },
        {
          type: "choice_text",
          label: WORDING_STANDARD.labels.pcHx,
          valuePrefix: `${WORDING_STANDARD.labels.pcHx}: `,
          selected: -1,
          options: [WORDING_STANDARD.terms.nil, "Pain", "Sensitivity", "Sharpness to tongue", "Mobility", WORDING_STANDARD.terms.other],
          customOptionIndex: 5,
          customValue: "",
          customPlaceholder: "Enter complaint history detail"
        },
        ...createPainAssessmentRows({
          complaintLabel: WORDING_STANDARD.labels.pcHx,
          includeSensitivitySite: false,
          siteLabel: "Pain site",
          siteValuePrefix: "Site: "
        }),
        {
          type: "text",
          label: WORDING_STANDARD.labels.oe,
          prefix: `${WORDING_STANDARD.labels.oe}: `,
          value: "",
          placeholder: "Enter examination findings"
        },
        { type: "line", text: "PA taken" },
        {
          type: "text",
          label: WORDING_STANDARD.labels.findings,
          prefix: `${WORDING_STANDARD.labels.findings}: `,
          value: "",
          placeholder: "Enter radiographic/clinical findings"
        },
        {
          type: "tooth_picker",
          label: "Tx SRD",
          valuePrefix: "Tx: SRD ",
          selectedMode: "nil",
          entries: [],
          nilOptionLabel: WORDING_STANDARD.terms.nil,
          selectOptionLabel: "Select teeth"
        },
        createInformedConsentLine(WORDING_STANDARD.phrases.informedConsentTreatment)
      ]
    },
    {
      id: "perio-emergency-la",
      title: "LA",
      included: true,
      rows: createLocalAnaestheticRows({
        methodLabel: "LA",
        methodValuePrefix: "LA: ",
        methodOptions: [WORDING_STANDARD.terms.nil, "Infiltration", "IDB", "IDB + Infiltration", WORDING_STANDARD.terms.other],
        methodCustomOptionIndex: 4,
        methodCustomPlaceholder: "Enter LA details",
        includeSitePicker: false,
        includeAgentAndVolume: false
      })
    },
    {
      id: "perio-emergency-treatment",
      title: "Treatment",
      included: true,
      rows: [
        { type: "line", text: "SRD completed with perio tip U/S. Pockets flushed with saline. POIG re perio care/eat on other side and soft food" },
        {
          type: "choice_text",
          label: "Medication",
          valuePrefix: "",
          selected: 0,
          options: [
            "No Abs indicated",
            "Allergies checked. Rx: Metronidazole 400mg 21 tabs, one every 8hrs until finished, no alcohol",
            WORDING_STANDARD.terms.other
          ],
          customOptionIndex: 2,
          customValue: "",
          customPlaceholder: "Enter medication details"
        },
        { type: "line", text: WORDING_STANDARD.phrases.patientSatisfiedOnDeparture },
        createNextVisitChoiceRow({
          selected: 0,
          options: ["Recall Exam 30mins", "Initial Exam 30mins", "Initial Exam 45mins", WORDING_STANDARD.terms.other],
          customOptionIndex: 3,
          customPlaceholder: "Enter next visit"
        })
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
  "freestyle-appointment": { title: "Freestyle Appointment", sections: createFreestyleAppointmentTemplateSections() },
  restoration: { title: "Restoration Template", sections: createRestorationTemplateSections() },
  "denture-stages": { title: "Denture Stages", sections: createDentureStagesTemplateSections() },
  endo: { title: "Endodontics", sections: createEndodonticsTemplateSections() },
  "new-patient-exam": { title: "Exam and Clean", sections: createNewPatientTemplateSections() },
  "child-exam": { title: "Child Exam", sections: createChildExamTemplateSections() },
  "recall-exam": { title: "Recall Exam", sections: createPlaceholderTemplateSections("Recall Exam", "Existing Adult recall flow placeholder.") },
  "child-recall-easy": { title: "Child Recall Easy", sections: createPlaceholderTemplateSections("Child Recall Easy", "Existing Child recall flow placeholder.") },
  "extraction-adult": { title: "Extraction - Adult", sections: createExtractionAdultTemplateSections() },
  "extraction-child": { title: "Extraction - Child", sections: createExtractionChildTemplateSections() },
  "crown-fit": { title: "Crown - Fit", sections: createCrownFitTemplateSections() },
  "crown-prep": { title: "Crown - Prep", sections: createCrownPrepTemplateSections() },
  "crown-recement": { title: "Crown - Recement", sections: createCrownRecementTemplateSections() },
  "periodontal-treatment": { title: "Periodontal - Treatment", sections: createPeriodontalTreatmentTemplateSections() },
  "periodontal-emergency": { title: "Periodontal - Emergency", sections: createPeriodontalEmergencyTemplateSections() },
  "child-new-0-6": { title: "New Child Exam (0-6)", sections: createPlaceholderTemplateSections("New Child Exam 0-6", "Child new patient branch placeholder.") },
  "child-new-6-8": { title: "New Child Exam (6-8)", sections: createPlaceholderTemplateSections("New Child Exam 6-8", "Child new patient branch placeholder.") },
  "child-new-9-12": { title: "New Child Exam (9-12)", sections: createPlaceholderTemplateSections("New Child Exam 9-12", "Child new patient branch placeholder.") },
  "child-new-12-18": { title: "New Child Exam (12-18)", sections: createPlaceholderTemplateSections("New Child Exam 12-18", "Child new patient branch placeholder.") }
};

const TEMPLATE_PICKER_OPTIONS = [
  { key: "freestyle-appointment", label: "Freestyle Appointment" },
  { key: "restoration", label: "Restoration" },
  { key: "denture-stages", label: "Denture Stages" },
  { key: "endo", label: "Endodontics" },
  { key: "new-patient-exam", label: "Exam > Adult" },
  { key: "child-exam", label: "Exam > Child" },
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
const saveDefaultsBtn = document.getElementById("saveDefaultsBtn");
const resetTemplateBtn = document.getElementById("resetTemplateBtn");
const builderEl = document.getElementById("builder");
const noteOutputEl = document.getElementById("noteOutput");
const undoActionBtn = document.getElementById("undoActionBtn");
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
const TEMPLATE_DEFAULTS_STORAGE_KEY = "pogoku_template_defaults_v1";
const UNDO_STACK_LIMIT = 80;

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
const SURFACE_OPTIONS = ["M", "O", "I", "D", "B", "Lab", "L", "P"];

let currentTemplateKey = "restoration";
let template = [];
let copyWarningTimer = null;
let examFlowStep = "root";
const toothModalState = {
  sectionIndex: -1,
  rowIndex: -1,
  selectedTeeth: new Set(),
  selectedSurfacesByTooth: {},
  activeTooth: "",
  includeSurfaces: true
};
const corgiIcons = ["assets/corgi/corgi-split-1.png", "assets/corgi/corgi-split-2.png", "assets/corgi/corgi-split-3.png"];
const rareMascotIcons = ["assets/corgi/ragdoll-split-1.png", "assets/corgi/ragdoll-split-2.png", "assets/corgi/ragdoll-split-3.png"];
const mascotEasterEggClickCount = 10;
const mascotEasterEggWindowMs = 5000;
let corgiIconIndex = 0;
let rareMascotIndex = 0;
let isRareMascot = false;
let mascotClickTimestamps = [];
let templateDefaultsMap = loadTemplateDefaultsMap();
let undoStack = [];
let lastUndoMeta = { actionKey: "", at: 0 };
let undoFlashTimer = null;

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

function updateUndoButtonState() {
  if (!undoActionBtn) {
    return;
  }
  const hasUndo = undoStack.length > 0;
  undoActionBtn.disabled = !hasUndo;
  undoActionBtn.title = hasUndo ? "Undo last action" : "No actions to undo";
}

function clearUndoHistory() {
  undoStack = [];
  lastUndoMeta = { actionKey: "", at: 0 };
  updateUndoButtonState();
}

function flashUndoButton(text) {
  if (!undoActionBtn) {
    return;
  }
  if (undoFlashTimer) {
    window.clearTimeout(undoFlashTimer);
  }
  undoActionBtn.textContent = text;
  undoFlashTimer = window.setTimeout(() => {
    undoActionBtn.textContent = "Undo";
  }, 900);
}

function pushUndoSnapshot(actionKey = "edit", options = {}) {
  if (!Array.isArray(template) || template.length === 0) {
    return;
  }

  const now = Date.now();
  const coalesceMs = options.coalesceMs || 0;
  if (coalesceMs > 0 && lastUndoMeta.actionKey === actionKey && now - lastUndoMeta.at < coalesceMs) {
    return;
  }

  undoStack.push({
    templateKey: currentTemplateKey,
    template: deepClone(template)
  });
  if (undoStack.length > UNDO_STACK_LIMIT) {
    undoStack.shift();
  }

  lastUndoMeta = { actionKey, at: now };
  updateUndoButtonState();
}

function undoLastAction() {
  if (undoStack.length === 0) {
    flashUndoButton("Nothing");
    return;
  }

  const snapshot = undoStack.pop();
  if (!snapshot || !Array.isArray(snapshot.template)) {
    updateUndoButtonState();
    return;
  }

  currentTemplateKey = snapshot.templateKey;
  template = deepClone(snapshot.template);
  if (builderTitleEl && TEMPLATE_LIBRARY[currentTemplateKey]) {
    builderTitleEl.textContent = TEMPLATE_LIBRARY[currentTemplateKey].title;
  }
  if (templatePickerEl) {
    templatePickerEl.value = currentTemplateKey;
  }
  closeToothModal();
  renderBuilder();
  renderOutput();
  updateUndoButtonState();
  flashUndoButton("Undid");
}

function loadTemplateDefaultsMap() {
  try {
    const raw = window.localStorage.getItem(TEMPLATE_DEFAULTS_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function persistTemplateDefaultsMap() {
  try {
    window.localStorage.setItem(TEMPLATE_DEFAULTS_STORAGE_KEY, JSON.stringify(templateDefaultsMap));
    return true;
  } catch (error) {
    return false;
  }
}

function clearDeletedFlagsInSections(sections) {
  if (!Array.isArray(sections)) {
    return sections;
  }
  sections.forEach((section) => {
    if (!section || !Array.isArray(section.rows)) {
      return;
    }
    section.rows.forEach((row) => {
      if (row && Object.prototype.hasOwnProperty.call(row, "deleted")) {
        delete row.deleted;
      }
    });
  });
  return sections;
}

function removeItemCodeRowsFromSections(sections) {
  if (!Array.isArray(sections)) {
    return sections;
  }
  sections.forEach((section) => {
    if (!section || !Array.isArray(section.rows)) {
      return;
    }
    section.rows = section.rows.filter((row) => {
      if (!row || typeof row !== "object") {
        return true;
      }
      const label = typeof row.label === "string" ? row.label.trim().toLowerCase() : "";
      return label !== "item codes";
    });
  });
  return sections;
}

function rowsMatchForSchema(savedRow, schemaRow) {
  if (!savedRow || !schemaRow) {
    return false;
  }
  if (savedRow.type !== schemaRow.type) {
    return false;
  }
  if (schemaRow.label) {
    return savedRow.label === schemaRow.label;
  }
  if (schemaRow.type === "line") {
    return savedRow.text === schemaRow.text;
  }
  return false;
}

function copySavedRowStateIntoSchemaRow(schemaRow, savedRow) {
  if (!schemaRow || !savedRow) {
    return;
  }
  if (Object.prototype.hasOwnProperty.call(savedRow, "selected")) {
    schemaRow.selected = Array.isArray(savedRow.selected) ? [...savedRow.selected] : savedRow.selected;
  }
  if (Object.prototype.hasOwnProperty.call(savedRow, "selectedMode")) {
    schemaRow.selectedMode = savedRow.selectedMode;
  }
  if (Object.prototype.hasOwnProperty.call(savedRow, "customValue")) {
    schemaRow.customValue = savedRow.customValue;
  }
  if (Object.prototype.hasOwnProperty.call(savedRow, "value")) {
    schemaRow.value = savedRow.value;
  }
  if (Array.isArray(savedRow.entries)) {
    schemaRow.entries = [...savedRow.entries];
  }
  if (Object.prototype.hasOwnProperty.call(savedRow, "deleted")) {
    schemaRow.deleted = savedRow.deleted;
  }
}

function mergeTemplateSectionsWithSavedDefaults(schemaSections, savedSections) {
  if (!Array.isArray(schemaSections) || !Array.isArray(savedSections)) {
    return schemaSections;
  }

  schemaSections.forEach((schemaSection) => {
    if (!schemaSection || !Array.isArray(schemaSection.rows)) {
      return;
    }
    const savedSection = savedSections.find((section) => section && section.id === schemaSection.id);
    if (!savedSection || !Array.isArray(savedSection.rows)) {
      return;
    }

    if (typeof savedSection.included === "boolean") {
      schemaSection.included = savedSection.included;
    }

    const matchedSavedIndices = new Set();
    schemaSection.rows.forEach((schemaRow) => {
      const matchedIndex = savedSection.rows.findIndex((savedRow, index) => {
        if (matchedSavedIndices.has(index)) {
          return false;
        }
        return rowsMatchForSchema(savedRow, schemaRow);
      });
      if (matchedIndex < 0) {
        return;
      }
      matchedSavedIndices.add(matchedIndex);
      copySavedRowStateIntoSchemaRow(schemaRow, savedSection.rows[matchedIndex]);
    });

    // Preserve any custom rows that existed only in saved defaults.
    savedSection.rows.forEach((savedRow, index) => {
      if (matchedSavedIndices.has(index)) {
        return;
      }
      if (!savedRow || typeof savedRow !== "object") {
        return;
      }
      schemaSection.rows.push(deepClone(savedRow));
    });
  });

  return schemaSections;
}

function normalizeNewPatientWording(sections) {
  if (!Array.isArray(sections)) {
    return sections;
  }
  const attendanceSection = sections.find((section) => section && section.id === "npe-attendance");
  if (attendanceSection && Array.isArray(attendanceSection.rows)) {
    attendanceSection.rows = attendanceSection.rows.filter((row) => row && row.label !== "Reason for attendance");
    const examTypeRow = attendanceSection.rows.find((row) => row && row.label === "Exam Type" && Array.isArray(row.options));
    if (examTypeRow && examTypeRow.options.length >= 2) {
      examTypeRow.options[1] = "RFA: Recall Exam and Clean";
    }
  }

  const dentalExamSection = sections.find((section) => section && section.id === "dental-exam");
  if (dentalExamSection && Array.isArray(dentalExamSection.rows)) {
    dentalExamSection.rows = dentalExamSection.rows.filter((row) => !(row && row.type === "line" && row.text === "Teeth charted."));
    const leakingRestosRow = dentalExamSection.rows.find(
      (row) => row && row.type === "tooth_picker" && row.label === "Leaking or defective restorations"
    );
    if (leakingRestosRow) {
      leakingRestosRow.includeSurfaces = true;
      leakingRestosRow.nilOptionLabel = "Nil";
      leakingRestosRow.selectOptionLabel = "Select teeth/surfaces";
    }
  }

  const diagnosisSection = sections.find((section) => section && section.id === "diagnosis");
  if (diagnosisSection && Array.isArray(diagnosisSection.rows)) {
    const modifyingFactorOptions = [
      "Family history",
      "Diabetes",
      "Smoking"
    ];

    const existingModifyingFactorRow = diagnosisSection.rows.find((row) => row && row.label === "Modifying factor");
    let preservedSelected = [];
    if (existingModifyingFactorRow) {
      if (existingModifyingFactorRow.type === "multi_choice" && Array.isArray(existingModifyingFactorRow.selected)) {
        const existingOptions = Array.isArray(existingModifyingFactorRow.options) ? existingModifyingFactorRow.options : [];
        preservedSelected = existingModifyingFactorRow.selected
          .map((index) => (Number.isInteger(index) && index >= 0 ? existingOptions[index] : ""))
          .map((optionText) => modifyingFactorOptions.indexOf(optionText))
          .filter((index) => index >= 0);
      } else if (existingModifyingFactorRow.type === "choice_text") {
        const selectedOptionText = existingModifyingFactorRow.options?.[existingModifyingFactorRow.selected];
        const mappedIndex = modifyingFactorOptions.indexOf(selectedOptionText);
        if (mappedIndex >= 0) {
          preservedSelected = [mappedIndex];
        }
      }
    }

    diagnosisSection.rows = diagnosisSection.rows.filter((row) => !(row && row.label === "Modifying factor"));

    const normalizedModifyingFactorRow = {
      type: "multi_choice",
      label: "Modifying factor",
      valuePrefix: "Modifying factor: ",
      selected: preservedSelected,
      options: modifyingFactorOptions
    };

    const gradeRowIndex = diagnosisSection.rows.findIndex((row) => row && row.label === "Grade");
    if (gradeRowIndex >= 0) {
      diagnosisSection.rows.splice(gradeRowIndex + 1, 0, normalizedModifyingFactorRow);
    } else {
      diagnosisSection.rows.push(normalizedModifyingFactorRow);
    }
  }

  const thisVisitSection = sections.find((section) => section && section.id === "tx-plan");
  if (thisVisitSection && Array.isArray(thisVisitSection.rows)) {
    thisVisitSection.title = "THIS VISIT";
    const combinedLegacyLine = "S/C completed with US. Teeth polished with prophy paste. Topical Fluoride 9000ppm applied on teeth and POIG.";
    const treatmentOptions = [
      "S/C completed with US.",
      "Teeth polished with prophy paste.",
      "Topical Fluoride 9000ppm applied on teeth and POIG."
    ];
    let preservedScSelection = [0, 1, 2];
    thisVisitSection.rows.forEach((row) => {
      if (!row) {
        return;
      }
      if (row.type === "line") {
        const text = row.text || "";
        if (
          text === combinedLegacyLine
          || text === "1. S/C completed with US. Teeth polished with prophy paste. Topical Fluoride 9000ppm applied on teeth and POIG."
          || text === "THIS VISIT:"
        ) {
          preservedScSelection = [0, 1, 2];
          return;
        }
        const mappedFromLine = [];
        if (text.includes("S/C completed with US")) mappedFromLine.push(0);
        if (text.includes("Teeth polished with prophy paste")) mappedFromLine.push(1);
        if (text.includes("Topical Fluoride")) mappedFromLine.push(2);
        if (mappedFromLine.length > 0) {
          preservedScSelection = Array.from(new Set(mappedFromLine));
        }
      }
      if (row.label === "This visit treatment") {
        if (row.type === "multi_choice" && Array.isArray(row.selected)) {
          const existingOptions = Array.isArray(row.options) ? row.options : [];
          const mappedFromMulti = row.selected
            .map((index) => (Number.isInteger(index) && index >= 0 ? existingOptions[index] : ""))
            .flatMap((optionText) => {
              const mapped = [];
              if (optionText.includes("S/C completed with US")) mapped.push(0);
              if (optionText.includes("Teeth polished with prophy paste")) mapped.push(1);
              if (optionText.includes("Topical Fluoride")) mapped.push(2);
              return mapped;
            });
          preservedScSelection = Array.from(new Set(mappedFromMulti.filter((index) => index >= 0 && index < treatmentOptions.length)));
          return;
        }
        if ((row.type === "choice" || row.type === "choice_text") && typeof row.selected === "number" && row.selected >= 0) {
          const selectedText = Array.isArray(row.options) ? (row.options[row.selected] || "") : "";
          const mapped = [];
          if (selectedText.includes("S/C completed with US")) mapped.push(0);
          if (selectedText.includes("Teeth polished with prophy paste")) mapped.push(1);
          if (selectedText.includes("Topical Fluoride")) mapped.push(2);
          preservedScSelection = Array.from(new Set(mapped));
        }
      }
    });

    thisVisitSection.rows = thisVisitSection.rows.filter((row) => {
      if (!row) {
        return false;
      }
      if (row.type === "line" && (
        row.text === "THIS VISIT:"
        || row.text === combinedLegacyLine
        || row.text === "1. S/C completed with US. Teeth polished with prophy paste. Topical Fluoride 9000ppm applied on teeth and POIG."
        || row.text === "S/C completed with US."
        || row.text === "Teeth polished with prophy paste."
        || row.text === "Topical Fluoride 9000ppm applied on teeth and POIG."
      )) {
        return false;
      }
      return row.label !== "This visit treatment";
    });

    thisVisitSection.rows.unshift({
      type: "multi_choice",
      label: "This visit treatment",
      valuePrefix: "",
      selected: preservedScSelection,
      options: treatmentOptions
    });

    const canonicalOhiOptions = [
      "Encouraged to keep up OH habits",
      "Brush twice daily",
      "Brush near gumline",
      "Brush the back teeth thoroughly",
      "Brush inside surfaces of teeth",
      "Floss daily",
      "Modified Bass technique video shown"
    ];
    const ohiRows = thisVisitSection.rows.filter((row) => row && row.label === "OHI");
    let preservedSelected = [0];
    if (ohiRows.length > 0) {
      const multiRow = ohiRows.find((row) => row.type === "multi_choice");
      if (multiRow && Array.isArray(multiRow.selected)) {
        const existingOptions = Array.isArray(multiRow.options) ? multiRow.options : [];
        const mapped = multiRow.selected
          .map((index) => (Number.isInteger(index) && index >= 0 ? existingOptions[index] : ""))
          .map((optionText) => canonicalOhiOptions.indexOf(optionText))
          .filter((index) => index >= 0);
        if (mapped.length > 0) {
          preservedSelected = Array.from(new Set(mapped));
        }
      } else {
        const legacyChoiceRow = ohiRows.find((row) => row.type === "choice_text" || row.type === "choice");
        if (legacyChoiceRow && Array.isArray(legacyChoiceRow.options)) {
          const selectedText = legacyChoiceRow.options[legacyChoiceRow.selected] || "";
          const mappedIndex = canonicalOhiOptions.indexOf(selectedText);
          if (mappedIndex >= 0) {
            preservedSelected = [mappedIndex];
          }
        }
      }
    }
    thisVisitSection.rows = thisVisitSection.rows.filter((row) => !(row && row.label === "OHI"));
    thisVisitSection.rows.push({
      type: "multi_choice",
      label: "OHI",
      valuePrefix: "OHI: ",
      selected: preservedSelected,
      options: canonicalOhiOptions
    });
  }

  const restorationsSection = sections.find((section) => section && section.id === "restorations");
  if (restorationsSection && restorationsSection.title === "2. Restorations") {
    restorationsSection.title = "Restorations";
  }

  const radiographsSection = sections.find((section) => section && section.id === "radiographs");
  if (!radiographsSection || !Array.isArray(radiographsSection.rows)) {
    return sections;
  }

  radiographsSection.rows.forEach((row) => {
    if (!row || !Array.isArray(row.options)) {
      return;
    }
    if (row.label === WORDING_STANDARD.labels.bws && row.options.length >= 3) {
      row.options[0] = WORDING_STANDARD.terms.noneIndicatedToday;
      row.options[2] = WORDING_STANDARD.radiographs.bwsDeclinedExamIncomplete;
      return;
    }
    if (row.label === "Caries" && row.options.length >= 2) {
      row.options[0] = WORDING_STANDARD.terms.asAbove;
      row.options[1] = WORDING_STANDARD.terms.nil;
      return;
    }
    if (row.label === WORDING_STANDARD.labels.pas && row.options.length >= 2) {
      row.options[0] = WORDING_STANDARD.terms.noneIndicatedToday;
      row.options[1] = WORDING_STANDARD.radiographs.pasTakenForAssessment;
    }
  });

  return sections;
}

function standardizeCommonTemplateWording(sections) {
  if (!Array.isArray(sections)) {
    return sections;
  }

  const normalizeLabel = (label) => {
    if (label === "BWs") return WORDING_STANDARD.labels.bws;
    if (label === "PAs") return WORDING_STANDARD.labels.pas;
    if (label === "Sig Med hx" || label === "Sig Med Hx") return WORDING_STANDARD.labels.sigMedHx;
    if (label === "Attending with") return WORDING_STANDARD.labels.attendingWith;
    if (label === "PC Hx") return WORDING_STANDARD.labels.pcHx;
    if (label === "OE") return WORDING_STANDARD.labels.oe;
    if (label === "Findings") return WORDING_STANDARD.labels.findings;
    return label;
  };

  const normalizePrefix = (prefix) => {
    if (prefix === "BWs: ") return `${WORDING_STANDARD.labels.bws}: `;
    if (prefix === "PAs: ") return `${WORDING_STANDARD.labels.pas}: `;
    if (prefix === "Sig Med hx: " || prefix === "Sig Med Hx: ") return `${WORDING_STANDARD.labels.sigMedHx}: `;
    if (prefix === "Attending with: ") return `${WORDING_STANDARD.labels.attendingWith}: `;
    if (prefix === "PC Hx: ") return `${WORDING_STANDARD.labels.pcHx}: `;
    if (prefix === "OE: ") return `${WORDING_STANDARD.labels.oe}: `;
    if (prefix === "Findings: ") return `${WORDING_STANDARD.labels.findings}: `;
    return prefix;
  };

  const normalizeOption = (value) => {
    if (value === "Nil") return WORDING_STANDARD.terms.nil;
    if (value === "Other") return WORDING_STANDARD.terms.other;
    if (value === "Not indicated today") return WORDING_STANDARD.terms.noneIndicatedToday;
    if (value === "Bite wings taken for interproximal caries assessment and bone levels") return BWS_TAKEN_OPTION;
    if (value === "Pt declined bitewings, understands diagnosis may be incomplete") return WORDING_STANDARD.radiographs.bwsDeclinedExamIncomplete;
    if (value === "Pt not able to take bitewings, understands diagnosis may be incomplete") return WORDING_STANDARD.radiographs.bwsUnableExamIncomplete;
    return value;
  };

  sections.forEach((section) => {
    if (!section) {
      return;
    }
    if (section.title === "RFA: Emergency appt") {
      section.title = WORDING_STANDARD.labels.rfaEmergencyAppt;
    }
    if (!Array.isArray(section.rows)) {
      return;
    }
    section.rows.forEach((row) => {
      if (!row || typeof row !== "object") {
        return;
      }
      if (typeof row.label === "string") {
        row.label = normalizeLabel(row.label);
      }
      if (typeof row.valuePrefix === "string") {
        row.valuePrefix = normalizePrefix(row.valuePrefix);
      }
      if (typeof row.prefix === "string") {
        row.prefix = normalizePrefix(row.prefix);
      }
      if (Array.isArray(row.options)) {
        row.options = row.options.map((option) => (typeof option === "string" ? normalizeOption(option) : option));
      }
    });
  });

  return sections;
}

function getTemplateSectionsForLoad(key) {
  const savedSections = templateDefaultsMap[key];
  let sections;
  if (key === "new-patient-exam") {
    const schemaSections = removeItemCodeRowsFromSections(clearDeletedFlagsInSections(deepClone(TEMPLATE_LIBRARY[key].sections)));
    if (Array.isArray(savedSections)) {
      const cleanedSavedSections = removeItemCodeRowsFromSections(clearDeletedFlagsInSections(deepClone(savedSections)));
      sections = mergeTemplateSectionsWithSavedDefaults(schemaSections, cleanedSavedSections);
    } else {
      sections = schemaSections;
    }
    sections = standardizeCommonTemplateWording(sections);
    sections = normalizeNewPatientWording(sections);
    return sections;
  }

  if (Array.isArray(savedSections)) {
    sections = removeItemCodeRowsFromSections(clearDeletedFlagsInSections(deepClone(savedSections)));
  } else {
    sections = removeItemCodeRowsFromSections(clearDeletedFlagsInSections(deepClone(TEMPLATE_LIBRARY[key].sections)));
  }
  sections = standardizeCommonTemplateWording(sections);
  return sections;
}

function flashSaveDefaultsButton(text) {
  if (!saveDefaultsBtn) {
    return;
  }
  saveDefaultsBtn.textContent = text;
  window.setTimeout(() => {
    saveDefaultsBtn.textContent = "Save Defaults";
  }, 1200);
}

function saveCurrentTemplateDefaults() {
  if (!currentTemplateKey || !TEMPLATE_LIBRARY[currentTemplateKey]) {
    flashSaveDefaultsButton("No template");
    return;
  }
  const sanitizedTemplate = removeItemCodeRowsFromSections(clearDeletedFlagsInSections(deepClone(template)));
  templateDefaultsMap[currentTemplateKey] = sanitizedTemplate;
  const success = persistTemplateDefaultsMap();
  flashSaveDefaultsButton(success ? "Defaults Saved" : "Save Failed");
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

function normalizeNoteText(text) {
  return String(text || "").replace(/\r\n/g, "\n");
}

function buildHighlightedNoteHtml(plainText, generatedPlainText, generatedHtmlLines = []) {
  const currentLines = normalizeNoteText(plainText).split("\n");
  const generatedLines = normalizeNoteText(generatedPlainText).split("\n");

  return currentLines
    .map((line, index) => {
      const isManualLine = line !== (generatedLines[index] || "");
      if (!isManualLine && typeof generatedHtmlLines[index] === "string") {
        return generatedHtmlLines[index];
      }
      const escapedLine = escapeHtml(line);
      return isManualLine ? `<strong class="manual-edit-line">${escapedLine}</strong>` : escapedLine;
    })
    .join("<br>");
}

function applyManualEditStyling() {
  if (!noteOutputEl) {
    return;
  }
  const plainText = normalizeNoteText(noteOutputEl.dataset.plainText || noteOutputEl.innerText || "");
  const generatedPlainText = normalizeNoteText(noteOutputEl.dataset.generatedPlainText || "");
  let generatedHtmlLines = [];
  try {
    generatedHtmlLines = JSON.parse(noteOutputEl.dataset.generatedLineHtml || "[]");
  } catch (error) {
    generatedHtmlLines = [];
  }

  if (!plainText.trim()) {
    noteOutputEl.innerHTML = "";
    return;
  }

  noteOutputEl.innerHTML = buildHighlightedNoteHtml(plainText, generatedPlainText, generatedHtmlLines);
}

function enterNoteEditMode() {
  if (!noteOutputEl) {
    return;
  }
  const plainText = normalizeNoteText(noteOutputEl.dataset.plainText || noteOutputEl.innerText || "");
  noteOutputEl.textContent = plainText;
}

function loadTemplate(key, options = {}) {
  const clearUndo = options.clearUndo !== false;
  if (!TEMPLATE_LIBRARY[key]) {
    return;
  }
  currentTemplateKey = key;
  template = getTemplateSectionsForLoad(key);
  if (builderTitleEl) {
    builderTitleEl.textContent = TEMPLATE_LIBRARY[key].title;
  }
  if (templatePickerEl) {
    templatePickerEl.value = key;
  }
  closeToothModal();
  renderBuilder();
  renderOutput();
  if (clearUndo) {
    clearUndoHistory();
  } else {
    updateUndoButtonState();
  }
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
  noteOutputEl.dataset.plainText = normalizeNoteText(noteOutputEl.innerText || "");
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

function getExamTypeMode() {
  for (const section of template) {
    if (!Array.isArray(section.rows)) {
      continue;
    }
    const examTypeRow = section.rows.find((row) => row.label === "Exam Type");
    if (!examTypeRow) {
      continue;
    }
    if (Array.isArray(examTypeRow.modeValues)) {
      return examTypeRow.modeValues[examTypeRow.selected] || "";
    }
    return getRowSelectedText(examTypeRow);
  }
  return "";
}

function getChildAgeBandMode() {
  for (const section of template) {
    if (!Array.isArray(section.rows)) {
      continue;
    }
    const ageBandRow = section.rows.find((row) => row.label === "Age Band");
    if (!ageBandRow) {
      continue;
    }
    if (Array.isArray(ageBandRow.modeValues)) {
      return ageBandRow.modeValues[ageBandRow.selected] || "";
    }
    return getRowSelectedText(ageBandRow);
  }
  return "";
}

function matchesVisibilityTarget(value, target) {
  if (Array.isArray(target)) {
    return target.includes(value);
  }
  return value === target;
}

function getRowSelectedText(row) {
  if (row.type === "choice" || row.type === "choice_text") {
    return row.options[row.selected] || "";
  }
  return "";
}

function getRowSelectedValues(row) {
  if (row.type === "multi_choice") {
    const selectedIndices = Array.isArray(row.selected) ? row.selected : [];
    return selectedIndices.map((index) => row.options[index]).filter(Boolean);
  }
  const selectedText = getRowSelectedText(row);
  return selectedText ? [selectedText] : [];
}

function isSectionVisible(section) {
  if (section.showIfExamType) {
    const examTypeMode = getExamTypeMode();
    if (!matchesVisibilityTarget(examTypeMode, section.showIfExamType)) {
      return false;
    }
  }
  if (section.showIfAgeBand) {
    const ageBandMode = getChildAgeBandMode();
    if (!matchesVisibilityTarget(ageBandMode, section.showIfAgeBand)) {
      return false;
    }
  }
  return true;
}

function isRowVisible(section, row, restorationMode) {
  if (row.deleted) {
    return false;
  }
  if (row.showIfExamType) {
    const examTypeMode = getExamTypeMode();
    if (!matchesVisibilityTarget(examTypeMode, row.showIfExamType)) {
      return false;
    }
  }
  if (row.showIfAgeBand) {
    const ageBandMode = getChildAgeBandMode();
    if (!matchesVisibilityTarget(ageBandMode, row.showIfAgeBand)) {
      return false;
    }
  }
  if (row.showWhen && row.showWhen !== restorationMode) {
    return false;
  }
  if (row.showIf) {
    let dependencyRow = section.rows.find((candidate) => candidate.label === row.showIf.label);
    if (!dependencyRow && row.showIfGlobal) {
      for (const templateSection of template) {
        const matched = Array.isArray(templateSection.rows)
          ? templateSection.rows.find((candidate) => candidate.label === row.showIf.label)
          : null;
        if (matched) {
          dependencyRow = matched;
          break;
        }
      }
    }
    if (!dependencyRow) {
      return false;
    }
    const selectedValues = getRowSelectedValues(dependencyRow);
    if (Object.prototype.hasOwnProperty.call(row.showIf, "equals")) {
      return selectedValues.includes(row.showIf.equals);
    }
    if (Object.prototype.hasOwnProperty.call(row.showIf, "notEquals")) {
      return !selectedValues.includes(row.showIf.notEquals);
    }
    if (Object.prototype.hasOwnProperty.call(row.showIf, "includes")) {
      return selectedValues.includes(row.showIf.includes);
    }
    if (Object.prototype.hasOwnProperty.call(row.showIf, "excludes")) {
      return !selectedValues.includes(row.showIf.excludes);
    }
    if (Object.prototype.hasOwnProperty.call(row.showIf, "includesAny")) {
      const includesAny = Array.isArray(row.showIf.includesAny) ? row.showIf.includesAny : [row.showIf.includesAny];
      return includesAny.some((value) => selectedValues.includes(value));
    }
    if (Object.prototype.hasOwnProperty.call(row.showIf, "includesAll")) {
      const includesAll = Array.isArray(row.showIf.includesAll) ? row.showIf.includesAll : [row.showIf.includesAll];
      return includesAll.every((value) => selectedValues.includes(value));
    }
    if (Object.prototype.hasOwnProperty.call(row.showIf, "excludesAny")) {
      const excludesAny = Array.isArray(row.showIf.excludesAny) ? row.showIf.excludesAny : [row.showIf.excludesAny];
      return excludesAny.every((value) => !selectedValues.includes(value));
    }
    if (Object.prototype.hasOwnProperty.call(row.showIf, "excludesAll")) {
      const excludesAll = Array.isArray(row.showIf.excludesAll) ? row.showIf.excludesAll : [row.showIf.excludesAll];
      return !excludesAll.every((value) => selectedValues.includes(value));
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
  if (row.linkedTo && currentTemplateKey !== "denture-stages") {
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
      pushUndoSnapshot(`delete:${sectionIndex}:${rowIndex}`);
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
  toothModalState.selectedTeeth = new Set();
  toothModalState.selectedSurfacesByTooth = {};
  toothModalState.activeTooth = "";
  toothModalState.includeSurfaces = true;
}

function isUpperTooth(tooth) {
  const quadrant = Number(String(tooth || "").charAt(0));
  return [1, 2, 5, 6].includes(quadrant);
}

function isAnteriorTooth(tooth) {
  const position = Number(String(tooth || "").charAt(1));
  return position >= 1 && position <= 3;
}

function getSelectedTeethSet() {
  if (!toothModalState.includeSurfaces) {
    return toothModalState.selectedTeeth;
  }
  return new Set(Object.keys(toothModalState.selectedSurfacesByTooth));
}

function getSelectedTeethInOrder() {
  const selectedSet = getSelectedTeethSet();
  return TOOTH_GROUPS.flatMap((group) => group.teeth).filter((tooth) => selectedSet.has(tooth));
}

function getSurfaceSetForTooth(tooth) {
  return toothModalState.selectedSurfacesByTooth[tooth] || new Set();
}

function getCanonicalSurfaceText(tooth, surfaceSet) {
  if (!(surfaceSet instanceof Set) || surfaceSet.size === 0) {
    return "";
  }
  const has = (surface) => surfaceSet.has(surface);
  const center = has("I") ? "I" : has("O") ? "O" : "";

  let core = "";
  if (center) {
    if (has("M") && has("D")) {
      core = `M${center}D`;
    } else if (has("M")) {
      core = `M${center}`;
    } else if (has("D")) {
      core = `D${center}`;
    } else {
      core = center;
    }
  } else {
    core = `${has("M") ? "M" : ""}${has("D") ? "D" : ""}`;
  }

  const hasB = has("B");
  const hasLab = has("Lab");
  let facial = "";
  if (hasB && hasLab) {
    facial = isAnteriorTooth(tooth) ? "Lab" : "B";
  } else if (hasLab) {
    facial = "Lab";
  } else if (hasB) {
    facial = "B";
  }

  const hasL = has("L");
  const hasP = has("P");
  let lingual = "";
  if (hasL && hasP) {
    lingual = isUpperTooth(tooth) ? "P" : "L";
  } else if (hasP) {
    lingual = "P";
  } else if (hasL) {
    lingual = "L";
  }

  return `${core}${facial}${lingual}`;
}

function formatToothSelectionEntry(tooth) {
  if (!toothModalState.includeSurfaces) {
    return tooth;
  }
  const surfaces = getCanonicalSurfaceText(tooth, getSurfaceSetForTooth(tooth));
  return surfaces ? `${tooth}${surfaces}` : tooth;
}

function hasSurfaceForEverySelectedTooth() {
  if (!toothModalState.includeSurfaces) {
    return true;
  }
  const selectedTeeth = getSelectedTeethInOrder();
  if (selectedTeeth.length === 0) {
    return false;
  }
  return selectedTeeth.every((tooth) => getSurfaceSetForTooth(tooth).size > 0);
}

function updateToothModalUi() {
  const selectedSet = getSelectedTeethSet();
  toothGridEl.querySelectorAll("button").forEach((button) => {
    const isSelected = selectedSet.has(button.dataset.tooth);
    const isFocused = toothModalState.includeSurfaces && toothModalState.activeTooth === button.dataset.tooth;
    button.classList.toggle("active", isSelected);
    button.classList.toggle("focused", isFocused);
  });

  const activeToothSurfaces = toothModalState.activeTooth ? getSurfaceSetForTooth(toothModalState.activeTooth) : new Set();
  surfaceGridEl.querySelectorAll("button").forEach((button) => {
    const isActive = toothModalState.includeSurfaces && activeToothSurfaces.has(button.dataset.surface);
    button.classList.toggle("active", isActive);
    button.disabled = toothModalState.includeSurfaces && !toothModalState.activeTooth;
  });

  const selectedTeeth = getSelectedTeethInOrder();

  if (selectedTeeth.length === 0) {
    toothSelectionPreviewEl.textContent = "Selected: none";
  } else if (toothModalState.includeSurfaces) {
    const entries = selectedTeeth.map((tooth) => {
      const surfaces = getCanonicalSurfaceText(tooth, getSurfaceSetForTooth(tooth));
      return surfaces ? `${tooth}${surfaces}` : `${tooth}(...)`;
    });
    const ready = hasSurfaceForEverySelectedTooth();
    const helper = toothModalState.activeTooth
      ? ` | editing ${toothModalState.activeTooth}`
      : " | select a tooth";
    toothSelectionPreviewEl.textContent = `Selected: ${entries.join(", ")}${ready ? "" : " | choose surfaces for each tooth"}${helper}`;
  } else {
    toothSelectionPreviewEl.textContent = `Selected: ${selectedTeeth.join(", ")}`;
  }

  addToothSelectionBtn.disabled = selectedTeeth.length === 0 || !hasSurfaceForEverySelectedTooth();
}

function openToothModal(sectionIndex, rowIndex, options = {}) {
  const includeSurfaces = options.includeSurfaces ?? true;
  const title = options.title || (includeSurfaces ? "Select teeth and surfaces" : "Select teeth");

  toothModalState.sectionIndex = sectionIndex;
  toothModalState.rowIndex = rowIndex;
  toothModalState.selectedTeeth = new Set();
  toothModalState.selectedSurfacesByTooth = {};
  toothModalState.activeTooth = "";
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
        if (toothModalState.includeSurfaces) {
          if (Object.prototype.hasOwnProperty.call(toothModalState.selectedSurfacesByTooth, tooth)) {
            if (toothModalState.activeTooth === tooth) {
              delete toothModalState.selectedSurfacesByTooth[tooth];
              const remaining = getSelectedTeethInOrder();
              toothModalState.activeTooth = remaining.length > 0 ? remaining[remaining.length - 1] : "";
            } else {
              toothModalState.activeTooth = tooth;
            }
          } else {
            toothModalState.selectedSurfacesByTooth[tooth] = new Set();
            toothModalState.activeTooth = tooth;
          }
        } else {
          if (toothModalState.selectedTeeth.has(tooth)) {
            toothModalState.selectedTeeth.delete(tooth);
          } else {
            toothModalState.selectedTeeth.add(tooth);
          }
        }
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
      if (!toothModalState.includeSurfaces || !toothModalState.activeTooth) {
        return;
      }
      const tooth = toothModalState.activeTooth;
      if (!Object.prototype.hasOwnProperty.call(toothModalState.selectedSurfacesByTooth, tooth)) {
        toothModalState.selectedSurfacesByTooth[tooth] = new Set();
      }
      const currentSurfaces = toothModalState.selectedSurfacesByTooth[tooth];
      if (currentSurfaces.has(surface)) {
        currentSurfaces.delete(surface);
      } else {
        currentSurfaces.add(surface);
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

function getSectionById(sectionId) {
  return template.find((section) => section && section.id === sectionId && section.included);
}

function hasEmptyOtherSelection(row) {
  if (!row || row.type !== "choice_text") {
    return false;
  }
  if (row.selected !== row.customOptionIndex) {
    return false;
  }
  return !((row.customValue || "").trim());
}

function getExtractionEndoCopyWarning() {
  const consentSectionByTemplate = {
    "extraction-adult": "exo-adult-consent",
    "extraction-child": "exo-child-consent"
  };

  const consentSectionId = consentSectionByTemplate[currentTemplateKey];
  if (!consentSectionId) {
    return "";
  }

  const consentSection = getSectionById(consentSectionId);
  if (!consentSection || !Array.isArray(consentSection.rows)) {
    return "";
  }

  const requiredConsentLabels = ["Options discussed", "Consent discussion", "Patient questions", "Written consent"];
  for (const label of requiredConsentLabels) {
    const row = consentSection.rows.find((candidate) => candidate && candidate.label === label && !candidate.deleted);
    if (!row || row.selected < 0) {
      return "Complete consent fields before copying.";
    }
    if (hasEmptyOtherSelection(row)) {
      return "Add details for consent fields marked Other before copying.";
    }
  }

  const medicationSection = getSectionById(currentTemplateKey === "extraction-adult" ? "exo-adult-treatment" : "exo-child-treatment");
  if (!medicationSection || !Array.isArray(medicationSection.rows)) {
    return "";
  }

  const medicationRow = medicationSection.rows.find((row) => row && row.label === "Medication prescribed/administered" && !row.deleted);
  const medicationDetailRow = medicationSection.rows.find((row) => row && row.label === "Medication details" && !row.deleted);
  const medicationValue = getRowSelectedText(medicationRow);
  if (
    medicationDetailRow &&
    ["Analgesic prescription issued", "Antibiotic prescription issued", WORDING_STANDARD.terms.other].includes(medicationValue) &&
    !((medicationDetailRow.value || "").trim())
  ) {
    return "Add medication details before copying.";
  }
  if (hasEmptyOtherSelection(medicationRow)) {
    return "Add details for medication marked Other before copying.";
  }

  const adverseRow = medicationSection.rows.find((row) => row && row.label === "Complications/adverse events" && !row.deleted);
  const adverseManagementRow = medicationSection.rows.find((row) => row && row.label === "Complication management" && !row.deleted);
  const adverseValue = getRowSelectedText(adverseRow);
  if (
    adverseManagementRow &&
    adverseValue &&
    adverseValue !== WORDING_STANDARD.terms.nil &&
    !((adverseManagementRow.value || "").trim())
  ) {
    return "Add complication management details before copying.";
  }
  if (hasEmptyOtherSelection(adverseRow)) {
    return "Add details for complications/adverse events marked Other before copying.";
  }

  return "";
}

function resetTemplate() {
  pushUndoSnapshot(`reset:${currentTemplateKey}`);
  loadTemplate(currentTemplateKey, { clearUndo: false });
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
  nilChip.textContent = row.nilOptionLabel || WORDING_STANDARD.terms.nil;
  if (row.selectedMode === "nil") {
    nilChip.classList.add("active");
  }
  nilChip.addEventListener("click", () => {
    pushUndoSnapshot(`tooth-mode:${sectionIndex}:${rowIndex}`);
    const currentMode = template[sectionIndex].rows[rowIndex].selectedMode;
    template[sectionIndex].rows[rowIndex].selectedMode = currentMode === "nil" ? "none" : "nil";
    renderBuilder();
    renderOutput();
  });

  const selectTeethChip = document.createElement("button");
  selectTeethChip.type = "button";
  selectTeethChip.className = "chip";
  selectTeethChip.textContent = row.selectOptionLabel || (row.includeSurfaces ? "Select teeth/surfaces" : "Select teeth");
  if (row.selectedMode === "teeth") {
    selectTeethChip.classList.add("active");
  }
  selectTeethChip.addEventListener("click", () => {
    if (template[sectionIndex].rows[rowIndex].selectedMode === "teeth") {
      pushUndoSnapshot(`tooth-mode:${sectionIndex}:${rowIndex}`);
      template[sectionIndex].rows[rowIndex].selectedMode = "none";
      renderBuilder();
      renderOutput();
      return;
    }
    pushUndoSnapshot(`tooth-mode:${sectionIndex}:${rowIndex}`);
    template[sectionIndex].rows[rowIndex].selectedMode = "teeth";
    const includeSurfaces = row.includeSurfaces === true;
    openToothModal(sectionIndex, rowIndex, {
      includeSurfaces,
      title: modalTitle || (includeSurfaces ? "Select teeth and surfaces" : "Select teeth")
    });
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
        pushUndoSnapshot(`tooth-entry-remove:${sectionIndex}:${rowIndex}`);
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
    if (!isSectionVisible(section)) {
      return;
    }
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
      pushUndoSnapshot(`section-include:${sectionIndex}`);
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
          renderToothPickerRow(
            sectionEl,
            sectionIndex,
            rowIndex,
            row,
            row.includeSurfaces ? "Select teeth and surfaces" : "Select teeth"
          );
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
            openToothModal(sectionIndex, rowIndex, { includeSurfaces: true, title: "Select teeth and surfaces" });
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
                pushUndoSnapshot(`surface-entry-remove:${sectionIndex}:${rowIndex}`);
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
              pushUndoSnapshot(`choice-text:${sectionIndex}:${rowIndex}`);
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
              pushUndoSnapshot(`choice-text-input:${sectionIndex}:${rowIndex}`, { coalesceMs: 1200 });
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
            pushUndoSnapshot(`text-input:${sectionIndex}:${rowIndex}`, { coalesceMs: 1200 });
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
              pushUndoSnapshot(`multi-choice:${sectionIndex}:${rowIndex}`);
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
            pushUndoSnapshot(`choice:${sectionIndex}:${rowIndex}`);
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
  const generatedPlainLines = [];
  const generatedHtmlLines = [];

  template.forEach((section) => {
    if (!isSectionVisible(section)) {
      return;
    }
    if (!section.included) {
      return;
    }

    const restorationMode = getRestorationMode(section);
    const plainLines = [];
    const htmlLines = [];
    if (!section.hideTitle) {
      plainLines.push(`${section.title}:`);
      htmlLines.push(`${escapeHtml(section.title)}:`);
    }

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
          const line = `${row.valuePrefix}${row.nilOutputText || WORDING_STANDARD.terms.nil}`;
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
        if (!value && !row.showEmpty) {
          return;
        }
        const prefixed = row.prefix
          ? `${row.prefix}${value}`.trimEnd()
          : value;
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

    if (currentTemplateKey === "new-patient-exam" && section.id === "diagnosis") {
      const dentalExamSection = template.find((candidate) => candidate && candidate.id === "dental-exam");
      const dentalRows = Array.isArray(dentalExamSection?.rows) ? dentalExamSection.rows : [];

      const cariesRow = dentalRows.find((row) => row && row.type === "tooth_picker" && row.label === "Caries");
      const hasCariesSelections = cariesRow
        && cariesRow.selectedMode === "teeth"
        && Array.isArray(cariesRow.entries)
        && cariesRow.entries.length > 0;
      const cariesLine = hasCariesSelections
        ? `Caries: ${cariesRow.entries.join(", ")}`
        : "Caries: Nil caries";
      plainLines.push(cariesLine);
      htmlLines.push(escapeHtml(cariesLine));

      const leakingRow = dentalRows.find(
        (row) => row && row.type === "tooth_picker" && row.label === "Leaking or defective restorations"
      );
      const hasLeakingSelections = leakingRow
        && leakingRow.selectedMode === "teeth"
        && Array.isArray(leakingRow.entries)
        && leakingRow.entries.length > 0;
      if (hasLeakingSelections) {
        const leakingLine = `Leaking or defective restorations: ${leakingRow.entries.join(", ")}`;
        plainLines.push(leakingLine);
        htmlLines.push(escapeHtml(leakingLine));
      }
    }

    const minLinesRequired = section.hideTitle ? 1 : 2;
    if (plainLines.length >= minLinesRequired) {
      if (generatedPlainLines.length > 0) {
        generatedPlainLines.push("");
        generatedHtmlLines.push("");
      }
      generatedPlainLines.push(...plainLines);
      generatedHtmlLines.push(...htmlLines);
      plainSections.push(plainLines.join("\n"));
      htmlSections.push(htmlLines.join("<br>"));
    }
  });

  const plainText = plainSections.join("\n\n");
  noteOutputEl.dataset.plainText = plainText;
  noteOutputEl.dataset.generatedPlainText = plainText;
  noteOutputEl.dataset.generatedLineHtml = JSON.stringify(generatedHtmlLines);
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

  const extractionEndoWarning = getExtractionEndoCopyWarning();
  if (extractionEndoWarning) {
    showCopyWarning(extractionEndoWarning);
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
  if (toothModalState.sectionIndex < 0 || toothModalState.rowIndex < 0) {
    return;
  }
  const selectedTeeth = getSelectedTeethInOrder();
  if (selectedTeeth.length === 0) {
    return;
  }
  if (!hasSurfaceForEverySelectedTooth()) {
    return;
  }

  pushUndoSnapshot(`tooth-entry-add:${toothModalState.sectionIndex}:${toothModalState.rowIndex}`);
  const section = template[toothModalState.sectionIndex];
  const row = section.rows[toothModalState.rowIndex];
  if (!Array.isArray(row.entries)) {
    row.entries = [];
  }
  selectedTeeth.forEach((tooth) => {
    const entry = formatToothSelectionEntry(tooth);
    if (!row.entries.includes(entry)) {
      row.entries.push(entry);
    }
  });
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
if (saveDefaultsBtn) {
  saveDefaultsBtn.addEventListener("click", saveCurrentTemplateDefaults);
}
if (undoActionBtn) {
  undoActionBtn.addEventListener("click", undoLastAction);
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
  noteOutputEl.addEventListener("focus", enterNoteEditMode);
  noteOutputEl.addEventListener("blur", applyManualEditStyling);
  noteOutputEl.addEventListener("input", syncEditedNoteToPlainText);
}

buildToothModal();
mountPathwaysInTemplateZone();
renderExamFlow();
buildTemplatePicker();
loadTemplate(currentTemplateKey);
startLandingClock();
setViewportMode("landing");



