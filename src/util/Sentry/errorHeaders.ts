export const ERROR_HEADERS = {
  GENERIC: "Generic error.",
  UNKNOWN: "Unknown error.",
  ORGANIZATION: {
    FAILURE_GET: "Could not get organizations."
  },
  DOCTOR: {
    FAILURE_GET_PROFILE: "could not get the profile of the doctor."
  },
  WAITING_ROOM: {
    FAILURE_GET_APPOINTMENT: "Could not get appointments for waiting room."
  },
  PRIVATE_EVENTS: {
    FAILURE_CREATE: "Could not create the private event.",
    FAILURE_DELETE: "Could not delete the private event."
  },
  APPOINTMENT: {
    FAILURE_GET_ON_DASHBOARD: "Could not reload the appointments on the Dashboard.",
    FAILURE_GET: "Could not get the appointment.",
    FAILURE_CANCEL: "Could not cancel the appointment.",
    FAILURE_STATUS_POST: "Could not update the appointment status."
  },
  SETTINGS: {
    FAILURE_PUT_PHOTO: "Could not upload the doctor photo."
  },
  SPECIALIZATIONS: {
    FAILURE_GET: "Could not get specializations."
  },
  DIAGNOSTIC_REPORT: {
    FAILURE_GET: "Could not get the diagnostic report."
  },
  SERVICE_REQUEST: {
    FAILURE_GET: "Could not get the study orders.",
    FAILURE_GET_DESCRIPTION: "Could not get the study description."
  },
  ENCOUNTER: {
    FAILURE_GET: "Could not get the encounter.",
    FAILURE_GET_IN_STUDY_ORDER: "Could not get the encounter in the creation of study order.",
    FAILURE_GET_IN_MEDICAL_SECTION: "Could not get the encounter in medical section.",
    FAILURE_GET_IN_PATIENT_SECTION: "Could not get the encounter in patient section.",
    FAILURE_PUT: "Could not update the encounter.",
    FAILURE_PUT_IN_MEDICAL_SECTION: "Could not update the encounter in medical section."
  },
  ENCOUNTER_HISTORY: {
    FAILURE_GET: "Could not get the history of encounters."
  },
  MEDICATION: {
    FAILURE_GET: "Could not get the medications."
  },
  STUDY_ORDER: {
    FAILURE_POST: "Could not generate a new study order."
  },
  STUDY_ORDER_TEMPLATE: {
    FAILURE_POST: "Could not add a new study order template.",
    FAILURE_PUT: "Could not update the study order template.",
    FAILURE_DELETE: "Could not delete the study order template.",
    FAILURE_GET: "Could not get the study order templates."
  },
  PRIVATE_COMMETS: {
    FAILURE_GET: "Could not get get private comments"
  },
  OPEN_HOURS: {
    FAILURE_VALIDATE: "Could not validate open hours."
  }
}