import * as Sentry from '@sentry/react';


// for example, we use to add the id of the appointment, doctor or patient
type CustomTags = Record<string, string>


/**
 * Function to handle exception before send to sentry
 * @param {CustomTags} customTags - any object with key value pairs (like <string, string>)
 * @param error - the exception that was thrown
 * @param {string} msgToSend - header of the card of error in sentry
 */
const handleSendSentry = (customTags:CustomTags, error, msgToSend:string) => {
  if (error) {
    if (msgToSend) Sentry.captureMessage(msgToSend)
    if (customTags) Sentry.setTags(customTags)
    // The response was made and the server responded with a 
    // status code that is outside the 2xx range.
    if (error.response) {
      Sentry.setTags({
        "content-type": error.response.headers["content-type"] ?? "empty",
        "status-code": error.response.status ?? "empty",
        "error-scope": "response"
      })
    } else if (error.request) { // The request was made but no response was received
      Sentry.setTag("error-scope", "request")
    } else { // Something happened while preparing the request that threw an Error
      Sentry.setTags({
        "error-msg": error.message ?? "empty",
        "error-scope": "other"
      })
    }
    // avoid sending when the code is 401 so as not to saturate Sentry
    if (error.response) {
      if (error.response?.status !== 401) Sentry.captureException(error)
    } else {
      Sentry.captureException(error)
    }
  }
}


export default handleSendSentry;