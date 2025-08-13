import { readFileSync } from "fs";
import {
  FormConfigType,
  MockAction,
  MockOutput,
  saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { search_generator } from "./generator";
export class MockSearch extends MockAction {
  get saveData(): saveType {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "../save-data.yaml"), "utf8")
    ) as saveType;
  }
  get defaultData(): any {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "./default.yaml"), "utf8")
    );
  }
  get inputs(): FormConfigType | undefined {
    return [
      {
        name: "city_code",
        label: "Enter the city code",
        type: "text",
        payloadField: "$.context.city",
      },
      {
        name: "feature_discovery",
        label: "Features supported",
        type: "checkbox",
        options: [
          {
            code: "002",
            name: "Self-Pickup",
          },
          {
            code: "003",
            name: "Slotted delivery",
          },
          {
            code: "004",
            name: "Fulfillment by BNP",
          },
          {
            code: "005",
            name: "Force cancellation",
          },
          {
            code: "006",
            name: "Return with pickup",
          },
          {
            code: "007",
            name: "SNP collecting payment",
          },
          {
            code: "008",
            name: "Minimum order value",
          },
          {
            code: "0091",
            name: "Offer (discount)",
          },
          {
            code: "0092",
            name: "Offer (buyXgetY)",
          },
          {
            code: "0093",
            name: "Offer (freebie)",
          },
          {
            code: "0094",
            name: "Offer (slab)",
          },
          {
            code: "0095",
            name: "Offer (combo)",
          },
          {
            code: "0096",
            name: "Offer (delivery)",
          },
          {
            code: "0097",
            name: "Offer (exchange)",
          },
          {
            code: "0098",
            name: "Offer (financing)",
          },
          {
            code: "0099",
            name: "Purchase Finance by BNP",
          },
          {
            code: "00A",
            name: "Commercial model for BNP/SNP",
          },
          {
            code: "00B",
            name: "Replacement flow",
          },
          {
            code: "00C",
            name: "Exchange flow",
          },
          {
            code: "00D",
            name: "Cancel Return Request",
          },
          {
            code: "00E",
            name: "Update sale invoice",
          },
          {
            code: "00F",
            name: "Update delivery address",
          },
          {
            code: "010",
            name: "Update delivery authorization",
          },
          {
            code: "011",
            name: "Buyer instructions",
          },
          {
            code: "012",
            name: "Cash on delivery (COD) order",
          },
          {
            code: "013",
            name: "Order price adjustment, not tied to return or cancel",
          },
          {
            code: "014",
            name: "Cross-category order flow",
          },
          {
            code: "015",
            name: "Breakup of fulfillment level taxes in quote",
          },
          {
            code: "016",
            name: "Customization of input type text",
          },
          {
            code: "017",
            name: "Seller Creds",
          },
          {
            code: "018",
            name: "Cross-linking make-to-order item in quote_trail",
          },
          {
            code: "019",
            name: "Streamline fulfillment attributes for hyperlocal",
          },
          {
            code: "01A",
            name: "Item unitized count",
          },
          {
            code: "01B",
            name: "Minimum item quantity",
          },
          {
            code: "01C",
            name: "Identification of on-network LSP",
          },
          {
            code: "01D",
            name: "Option for multi-fulfillment order",
          },
          {
            code: "01E",
            name: "Cancellation terms",
          },
          {
            code: "01F",
            name: "Codified static terms",
          },
          {
            code: "020",
            name: "Fulfillment delay",
          },
          {
            code: "021",
            name: "Catalog as download link",
          },
          {
            code: "022",
            name: "BNP promotions planned",
          },
          {
            code: "023",
            name: "Full catalog refresh (search by item)",
          },
          {
            code: "024",
            name: "Full catalog refresh (search by fulfillment end location)",
          },
          {
            code: "025",
            name: "BNP demand signals",
          },
        ],
      },
    ];
  }
  name(): string {
    return "search";
  }
  get description(): string {
    return "Mock action for searching items in a grocery.";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return search_generator(existingPayload, sessionData);
  }
  async validate(targetPayload: any): Promise<MockOutput> {
            if (!targetPayload) {
              return { valid: false, message: "Payload is required", code: "ERR_PAYLOAD_MISSING" };
            }
          const {  message } = targetPayload;
          
            if (!message) {
              return { valid: false, message: "Message is required", code: "ERR_MESSAGE_MISSING" };
            }
          
            const intent = message.intent;
            if (!intent) {
              return { valid: false, message: "Message.intent is required", code: "ERR_INTENT_MISSING" };
            }
            if (intent.category && typeof intent.category.id !== "string") {
              return {
                valid: false,
                message: "Intent.category.id must be a string",
                code: "ERR_CATEGORY_ID"
              };
            }
            if (intent.fulfillment && typeof intent.fulfillment.type !== "string") {
              return {
                valid: false,
                message: "Intent.fulfillment.type must be a string",
                code: "ERR_FULFILLMENT_TYPE"
              };
            }
            
            if (intent.tags && Array.isArray(intent.tags)) {
              const bapFeaturesTag = intent.tags.find((tag: any) => tag.code === "bap_features");
          
              if (bapFeaturesTag) {
                if (!Array.isArray(bapFeaturesTag.list)) {
                  return {
                    valid: false,
                    message: "'bap_features' tag must contain a 'list' array",
                    code: "ERR_BAP_FEATURES_LIST"
                  };
                }
          
                for (const item of bapFeaturesTag.list) {
                  const val = item?.value?.toLowerCase();
                  if (!["yes", "no"].includes(val)) {
                    return {
                      valid: false,
                      message: `bap_features list item '${item.code}' must have value 'yes' or 'no'`,
                      code: "ERR_BAP_FEATURES_ENUM"
                    };
                  }
                }
              }
            }
          
            return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
    if (!sessionData.user_inputs) {
      return {
        valid: false,
        message: "User Inputs is required for search action",
      };
    }

    return { valid: true };
  }
}
