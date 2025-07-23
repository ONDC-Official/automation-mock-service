import { SessionData } from "../../../../session-types";
import { Fulfillments } from "../../api-objects/fulfillments";
import jsonpath from "jsonpath";

type tags = {
  code: string;
  list: {
    code: string;
    value: string;
  }[];
};

export async function update_reverse_qc_settlement_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.id = sessionData.order_id;
  const fulfillments = sessionData.fulfillments as Fulfillments;
  existingPayload.message.order.fulfillments = [];
  const returnId =
    fulfillments.filter((f) => f.type === "Return")[0]?.id || undefined;
  if (returnId) {
    existingPayload.message.order.fulfillments = [
      { id: returnId, type: "Return" },
    ];
  }

  const trail = jsonpath.query(
    sessionData.fulfillments,
    `$..tags[?(@.code=="quote_trail")]`
  ) as tags[];

  console.log("trail", JSON.stringify(trail, null, 2));

  const amounts = trail.flatMap((t) => {
    return t.list
      .filter((l) => l.code === "value")
      .map((l) => {
        return parseInt(l.value);
      });
  });
  const totalAmount = amounts.reduce((acc, curr) => acc + curr, 0);

  existingPayload.message.order.payment = {
    "@ondc/org/settlement_details": [
      {
        settlement_counterparty: "buyer",
        settlement_phase: "refund",
        settlement_type: "netbanking",
        settlement_amount: `${-1 * totalAmount}`,
        settlement_timestamp: new Date().toISOString(),
      },
    ],
  };

  return existingPayload;
}
