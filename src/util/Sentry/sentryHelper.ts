import * as Sentry from '@sentry/react';


// for example, we use to add the id of the appointment, doctor or patient
type CustomTags = Record<string, string | number | bigint | boolean | symbol>


/**
 * Function to handle exception before send to sentry
 * @param error - the exception that was thrown
 * @param {string} msgToSend - the header of the error in sentry
 * @param {CustomTags} customTags - (optional) any object with key value pairs (like <string, Primitive>)
 */
const handleSendSentry = (error, msgToSend:string, customTags?:CustomTags) => {
  // in any situation we set the tags
  if (customTags) Sentry.setTags(customTags)
  if (error) { // if we have the exception
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
      if (error.response?.status !== 401) Sentry.captureMessage(msgToSend ?? "Empty description")
    } else {
      Sentry.captureMessage(msgToSend ?? "Empty description")
    }
  } else { // In this case we cannot show a complete stack of errors.
    // if we only have message, then we capture it
    if (msgToSend) Sentry.captureMessage(msgToSend ?? "Empty description")
  }
}


export default handleSendSentry;