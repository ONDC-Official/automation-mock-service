import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../classes/mock-action";
import { SessionData } from "../../../session-types";
import { search_specific_hotel_generator } from "./generator";

export class SearchProviderSpecific extends MockAction {
  get saveData(): saveType {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "./save-data.yaml"), "utf8")
    ) as saveType;
  }
  get defaultData(): any {
    return yaml.load(
      readFileSync(
        path.resolve(__dirname, "./default.yaml"),
        "utf8"
      )
    );
  }
  get inputs(): any {
    return {};
  }
  name(): string {
    return "search_provider_specific";
  }
  get description(): string {
    return "Mock for search provider specific";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return search_specific_hotel_generator(existingPayload, sessionData);
  }
  async validate(targetPayload: any): Promise<MockOutput> {
    return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
    return { valid: true };
  }
}
