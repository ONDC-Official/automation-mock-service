export async function UpdatePartialConfirmCancelGenerator(
  existingPayload: any,
  sessionData: any
) {
	existingPayload.message = sessionData?.update_order
	existingPayload.message.order.cancellation.reason.descriptor.code = "CONFIRM_CANCEL"

  return existingPayload;
}
