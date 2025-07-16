import dayjs from "dayjs";

function getRandomDateBetween(start: any, end: any) {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const diff = endDate.diff(startDate, 'day');
  const randomOffset = Math.floor(Math.random() * (diff + 1));
  return startDate.add(randomOffset, 'day');
}

export async function onSearchIncrementalPull3Generator(existingPayload: any, sessionData: any) {
  const provider = existingPayload.message.catalog.providers[0];
  // Set collected_by
  if (sessionData.collected_by && provider.payments && provider.payments[0]) {
    provider.payments[0].collected_by = sessionData.collected_by;
  }
  // Set tags
  if (sessionData.tags) {
    existingPayload.message.catalog.tags = sessionData.tags;
  }
  // Set timerange
  if (sessionData.start_time && sessionData.end_time) {
    const randomDate = getRandomDateBetween(sessionData.start_time, sessionData.end_time);
    provider.time = {
      range: {
        start: randomDate.hour(5).minute(30).second(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        end: randomDate.hour(23).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      }
    };
  }
  // Update items if present in session
  if (Array.isArray(sessionData.items)) {
    provider.items = sessionData.items.map((item: any) => {
      if (provider.time) {
        item.time = { ...item.time, ...provider.time };
      }
      return item;
    });
  }
  return existingPayload;
} 