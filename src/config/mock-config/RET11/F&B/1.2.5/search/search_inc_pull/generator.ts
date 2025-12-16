import { SessionData, Input } from "../../../../session-types";
import { getFutureDate } from "../../../../../../../utils/generic-utils";

export const searchPullGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) => {
  existingPayload.message.intent.tags = [
    {
      code: "catalog_inc",
      list: [
        {
          code: "start_time",
          value: getFutureDate(-1, true), // default: 1 hour back
        },
        {
          code: "end_time",
          value: existingPayload.context.timestamp,
        },
      ],
    },
    {
      code: "bap_terms",
      list: [
        {
          code: "static_terms",
          value:
            "https://github.com/ONDC-Official/NP-Static-Terms/buyerNP_BNP/1.0/tc.pdf",
        },
        {
          code: "static_terms_new",
          value:
            "https://github.com/ONDC-Official/NP-Static-Terms/buyerNP_BNP/1.0/tc.pdf",
        },
        {
          code: "effective_date",
          value: getFutureDate(10, true),
        },
      ],
    },
  ];

  return existingPayload;
};
