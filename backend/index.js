/**
 * Background Function triggered by a change to a Firestore document.
 *
 * @param {!Object} event The Cloud Functions event.
 * @param {!Object} context Cloud Functions event metadata.
 */
export const hello = (event, context) => {
  const triggerResource = context.resource;

  console.log(`Function triggered by event on: ${triggerResource}`);
  console.log(`Event type: ${context.eventType}`);

  if (event.oldValue && Object.keys(event.oldValue).length) {
    console.log('\nOld value:');
    console.log(JSON.stringify(event.oldValue, null, 2));
  }

  if (event.value && Object.keys(event.value).length) {
    console.log('\nNew value:');
    console.log(JSON.stringify(event.value, null, 2));
  }
};
