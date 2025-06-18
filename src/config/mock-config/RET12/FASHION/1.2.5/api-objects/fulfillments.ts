import { SessionData } from "../../../session-types";
import { isoDurToSec } from "./utils";

export type Fulfillment = {
  /**
   * Unique reference ID to the fulfillment of an order
   */
  id?: string;
  /**
   * This describes the type of fulfillment ("Pickup" - Buyer picks up from store by themselves or through their logistics provider; "Delivery" - seller delivers to buyer)
   */
  type?: string;
  /**
   * fulfillment turnaround time in ISO8601 durations format e.g. 'PT24H' indicates 24 hour TAT
   */
  "@ondc/org/TAT"?: string;
  "@ondc/org/provider_name"?: string;
  provider_id?: string;
  /**
   * Describes the properties of a vehicle used in a mobility service
   */
  vehicle?: {
    registration?: string;
    [k: string]: unknown;
  };
  /**
   * Describes an order executor
   */
  agent?: {
    phone?: string;
    email?: string;
    [k: string]: unknown;
  };
  /**
   * Rating value given to the object (1 - Poor; 2 - Needs improvement; 3 - Satisfactory; 4 - Good; 5 - Excellent)
   */
  rating?: number;
  /**
   * Describes a state
   */
  state?: {
    /**
     * Describes the description of a real-world object.
     */
    descriptor?: {
      code?: string;
      name?: string;
      short_desc?: string;
      [k: string]: unknown;
    };
    updated_at?: string;
    [k: string]: unknown;
  };
  /**
   * Indicates whether the fulfillment allows tracking
   */
  tracking?: boolean;
  /**
   * Details on the start of fulfillment
   */
  start?: {
    /**
     * Describes the location of a runtime object.
     */
    location?: {
      id?: string;
      /**
       * Describes the description of a real-world object.
       */
      descriptor?: {
        code?: string;
        name?: string;
        short_desc?: string;
        [k: string]: unknown;
      };
      /**
       * Describes a gps coordinate
       */
      gps?: string;
      /**
       * Describes an address
       */
      address?: {
        /**
         * Name of address if applicable. Example, shop name
         */
        name?: string;
        /**
         * Name of the building or block
         */
        building?: string;
        /**
         * Street name or number
         */
        street?: string;
        /**
         * Name of the locality, apartments
         */
        locality?: string;
        /**
         * City name
         */
        city?: string;
        /**
         * State name
         */
        state?: string;
        /**
         * Country name
         */
        country?: string;
        /**
         * Area code. This can be Pincode, ZIP code or any equivalent
         */
        area_code?: string;
        [k: string]: unknown;
      };
      /**
       * Describes the location of a runtime object.
       */
      location?: {
        id?: string;
        /**
         * Describes the description of a real-world object.
         */
        descriptor?: {
          name?: string;
          code?: string;
          symbol?: string;
          short_desc?: string;
          long_desc?: string;
          images?: string[];
          tags?: {
            /**
             * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
             */
            code?: string;
            /**
             * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
             */
            list?: {
              /**
               * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
               */
              code?: string;
              /**
               * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
               */
              name?: string;
              /**
               * The value of the tag. This set by the BPP and rendered as-is by the BAP.
               */
              value?: string;
              [k: string]: unknown;
            }[];
            [k: string]: unknown;
          }[];
          [k: string]: unknown;
        };
        /**
         * Describes a gps coordinate
         */
        gps?: string;
        /**
         * Describes an address
         */
        address?: {
          /**
           * Name of address if applicable. Example, shop name
           */
          name?: string;
          /**
           * Name of the building or block
           */
          building?: string;
          /**
           * Street name or number
           */
          street?: string;
          /**
           * Name of the locality, apartments
           */
          locality?: string;
          /**
           * City name
           */
          city?: string;
          /**
           * State name
           */
          state?: string;
          /**
           * Country name
           */
          country?: string;
          /**
           * Area code. This can be Pincode, ZIP code or any equivalent
           */
          area_code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes a city
         */
        city?: {
          /**
           * Name of the city
           */
          name?: string;
          /**
           * Codification of city code will be using the std code of the city e.g. for Bengaluru, city code is 'std:080'
           */
          code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes a state.
         */
        state?: {
          /**
           * Name of the state
           */
          name?: string;
          /**
           * State code as per ISO 3166 Alpha-2 code format
           */
          code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes time in its various forms. It can be a single point in time; duration; or a structured timetable of operations
         */
        time?: {
          label?: string;
          timestamp?: string;
          range?: {
            start?: string;
            end?: string;
            [k: string]: unknown;
          };
          /**
           * comma separated values representing days of the week
           */
          days?: string;
          /**
           * Describes a schedule
           */
          schedule?: {
            /**
             * Describes duration as per ISO8601 format
             */
            frequency?: string;
            holidays?: string[];
            times?: string[];
            [k: string]: unknown;
          };
          [k: string]: unknown;
        };
        /**
         * Describes a circular area on the map
         */
        circle?: {
          /**
           * Describes a gps coordinate
           */
          gps?: string;
          /**
           * An object representing a scalar quantity.
           */
          radius?: {
            type?: string;
            value?: string;
            estimated_value?: number;
            computed_value?: number;
            range?: {
              min?: number;
              max?: number;
              [k: string]: unknown;
            };
            unit?: string;
            [k: string]: unknown;
          };
          [k: string]: unknown;
        };
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Describes time in its various forms. It can be a single point in time; duration; or a structured timetable of operations
     */
    time?: {
      label?: string;
      timestamp?: string;
      range?: {
        start?: string;
        end?: string;
        [k: string]: unknown;
      };
      /**
       * comma separated values representing days of the week
       */
      days?: string;
      /**
       * Describes a schedule
       */
      schedule?: {
        /**
         * Describes duration as per ISO8601 format
         */
        frequency?: string;
        holidays?: string[];
        times?: string[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Describes the description of a real-world object.
     */
    instructions?: {
      name?: string;
      code?: string;
      symbol?: string;
      short_desc?: string;
      long_desc?: string;
      images?: string[];
      tags?: {
        /**
         * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
         */
        code?: string;
        /**
         * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
         */
        list?: {
          /**
           * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
           */
          code?: string;
          /**
           * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
           */
          name?: string;
          /**
           * The value of the tag. This set by the BPP and rendered as-is by the BAP.
           */
          value?: string;
          [k: string]: unknown;
        }[];
        [k: string]: unknown;
      }[];
      [k: string]: unknown;
    };
    contact?: {
      phone?: string;
      email?: string;
      [k: string]: unknown;
    };
    /**
     * Describes a person.
     */
    person?: {
      /**
       * Describes the name of a person.
       */
      name?: string;
      [k: string]: unknown;
    };
    /**
     * Describes an authorization mechanism
     */
    authorization?: {
      /**
       * Type of authorization mechanism used
       */
      type?: string;
      /**
       * Token used for authorization
       */
      token?: string;
      /**
       * Timestamp in RFC3339 format from which token is valid
       */
      valid_from?: string;
      /**
       * Timestamp in RFC3339 format until which token is valid
       */
      valid_to?: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  /**
   * Details on the end of fulfillment
   */
  end?: {
    /**
     * Describes the location of a runtime object.
     */
    location?: {
      id?: string;
      /**
       * Describes the description of a real-world object.
       */
      descriptor?: {
        code?: string;
        name?: string;
        short_desc?: string;
        [k: string]: unknown;
      };
      /**
       * Describes a gps coordinate
       */
      gps?: string;
      /**
       * Describes an address
       */
      address?: {
        /**
         * Name of address if applicable. Example, shop name
         */
        name?: string;
        /**
         * Name of the building or block
         */
        building?: string;
        /**
         * Street name or number
         */
        street?: string;
        /**
         * Name of the locality, apartments
         */
        locality?: string;
        /**
         * City name
         */
        city?: string;
        /**
         * State name
         */
        state?: string;
        /**
         * Country name
         */
        country?: string;
        /**
         * Area code. This can be Pincode, ZIP code or any equivalent
         */
        area_code?: string;
        [k: string]: unknown;
      };
      /**
       * Describes the location of a runtime object.
       */
      location?: {
        id?: string;
        /**
         * Describes the description of a real-world object.
         */
        descriptor?: {
          name?: string;
          code?: string;
          symbol?: string;
          short_desc?: string;
          long_desc?: string;
          images?: string[];
          tags?: {
            /**
             * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
             */
            code?: string;
            /**
             * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
             */
            list?: {
              /**
               * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
               */
              code?: string;
              /**
               * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
               */
              name?: string;
              /**
               * The value of the tag. This set by the BPP and rendered as-is by the BAP.
               */
              value?: string;
              [k: string]: unknown;
            }[];
            [k: string]: unknown;
          }[];
          [k: string]: unknown;
        };
        /**
         * Describes a gps coordinate
         */
        gps?: string;
        /**
         * Describes an address
         */
        address?: {
          /**
           * Name of address if applicable. Example, shop name
           */
          name?: string;
          /**
           * Name of the building or block
           */
          building?: string;
          /**
           * Street name or number
           */
          street?: string;
          /**
           * Name of the locality, apartments
           */
          locality?: string;
          /**
           * City name
           */
          city?: string;
          /**
           * State name
           */
          state?: string;
          /**
           * Country name
           */
          country?: string;
          /**
           * Area code. This can be Pincode, ZIP code or any equivalent
           */
          area_code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes a city
         */
        city?: {
          /**
           * Name of the city
           */
          name?: string;
          /**
           * Codification of city code will be using the std code of the city e.g. for Bengaluru, city code is 'std:080'
           */
          code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes a state.
         */
        state?: {
          /**
           * Name of the state
           */
          name?: string;
          /**
           * State code as per ISO 3166 Alpha-2 code format
           */
          code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes time in its various forms. It can be a single point in time; duration; or a structured timetable of operations
         */
        time?: {
          label?: string;
          timestamp?: string;
          range?: {
            start?: string;
            end?: string;
            [k: string]: unknown;
          };
          /**
           * comma separated values representing days of the week
           */
          days?: string;
          /**
           * Describes a schedule
           */
          schedule?: {
            /**
             * Describes duration as per ISO8601 format
             */
            frequency?: string;
            holidays?: string[];
            times?: string[];
            [k: string]: unknown;
          };
          [k: string]: unknown;
        };
        /**
         * Describes a circular area on the map
         */
        circle?: {
          /**
           * Describes a gps coordinate
           */
          gps?: string;
          /**
           * An object representing a scalar quantity.
           */
          radius?: {
            type?: string;
            value?: string;
            estimated_value?: number;
            computed_value?: number;
            range?: {
              min?: number;
              max?: number;
              [k: string]: unknown;
            };
            unit?: string;
            [k: string]: unknown;
          };
          [k: string]: unknown;
        };
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Describes time in its various forms. It can be a single point in time; duration; or a structured timetable of operations
     */
    time?: {
      label?: string;
      timestamp?: string;
      range?: {
        start?: string;
        end?: string;
        [k: string]: unknown;
      };
      /**
       * comma separated values representing days of the week
       */
      days?: string;
      /**
       * Describes a schedule
       */
      schedule?: {
        /**
         * Describes duration as per ISO8601 format
         */
        frequency?: string;
        holidays?: string[];
        times?: string[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Describes the description of a real-world object.
     */
    instructions?: {
      name?: string;
      code?: string;
      symbol?: string;
      short_desc?: string;
      long_desc?: string;
      images?: string[];
      tags?: {
        /**
         * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
         */
        code?: string;
        /**
         * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
         */
        list?: {
          /**
           * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
           */
          code?: string;
          /**
           * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
           */
          name?: string;
          /**
           * The value of the tag. This set by the BPP and rendered as-is by the BAP.
           */
          value?: string;
          [k: string]: unknown;
        }[];
        [k: string]: unknown;
      }[];
      [k: string]: unknown;
    };
    contact?: {
      phone?: string;
      email?: string;
      [k: string]: unknown;
    };
    /**
     * Describes a person.
     */
    person?: {
      /**
       * Describes the name of a person.
       */
      name?: string;
      [k: string]: unknown;
    };
    /**
     * Describes an authorization mechanism
     */
    authorization?: {
      /**
       * Type of authorization mechanism used
       */
      type?: string;
      /**
       * Token used for authorization
       */
      token?: string;
      /**
       * Timestamp in RFC3339 format from which token is valid
       */
      valid_from?: string;
      /**
       * Timestamp in RFC3339 format until which token is valid
       */
      valid_to?: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  tags?: {
    /**
     * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
     */
    code?: string;
    /**
     * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
     */
    list?: {
      /**
       * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
       */
      code?: string;
      /**
       * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
       */
      name?: string;
      /**
       * The value of the tag. This set by the BPP and rendered as-is by the BAP.
       */
      value?: string;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
};
export type Fulfillments = Fulfillment[];

export function createFulfillments(
  action: string,
  actionId: string,
  sessionData: SessionData,
  defaultFulfillments: Fulfillments
) {
  if (defaultFulfillments.length < 1) {
    throw new Error("Empty fulfillments found");
  }
  if (action === "select") {
    // this function is not used in select
  }
  const onSelectFulfillments =
    sessionData.on_select_fulfillments as Fulfillments;
  if (action === "init") {
    const selected = sessionData.selected_fulfillments as Fulfillments;
    const defaultEnd = {
      end: {
        contact: {
          email: "nobody@nomail.com",
          phone: "9898989898",
        },
        location: {
          gps: selected[0].end?.location?.gps,
          address: {
            building: "mock-building",
            city: "mock-city",
            state: "mock-state",
            country: "IND",
            area_code:
              selected[0].end?.location?.address?.area_code || "400053",
            locality: "mock-locality",
            name: "mock-house-name",
          },
        },
      },
    };

    let targetFulfillment: Fulfillment | undefined = {};
    targetFulfillment = onSelectFulfillments.find((f) => f.type === "Delivery");
    const initFulfillments = [
      {
        id: targetFulfillment?.id || "F3",
        type: targetFulfillment?.type || "Delivery",
        end: defaultEnd.end,
      },
    ];

    return initFulfillments;
  }
  if (action === "on_init") {
    const fulfillments = sessionData.fulfillments as Fulfillments;
    return fulfillments.map((f) => {
      return {
        id: f.id,
        type: f.type,
        end: f.end,
        tracking: true,
      };
    });
  }
  if (action === "confirm") {
    const fulfillments = sessionData.fulfillments as Fulfillments;
    return fulfillments.map((f) => {
      const onSelectFulfillment = onSelectFulfillments.find(
        (of) => of.id === f.id
      );
      return {
        id: f.id,
        type: f.type,
        end: {
          contact: f.end?.contact,
          person: {
            name: "mock-person",
          },
          location: f.end?.location,
        },
        tracking: f.tracking,
        "@ondc/org/category": onSelectFulfillment?.["@ondc/org/category"],
        "@ondc/org/TAT": onSelectFulfillment?.["@ondc/org/TAT"],
      };
    });
  }
  if (action === "on_confirm") {
    const fulfillments = sessionData.fulfillments as Fulfillments;
    return fulfillments
      .filter((f) => onSelectFulfillments.some((sf) => sf.id === f.id))
      .map((f, index) => {
        const selected = onSelectFulfillments.find((sf) => sf.id === f.id)!;

        return {
          id: f.id,
          type: f.type,
          tracking: f.tracking,
          state: {
            descriptor: {
              code: "Pending",
            },
          },
          "@ondc/org/TAT": selected["@ondc/org/TAT"],
          "@ondc/org/provider_name": `mock_provider_name_${index}`,
          start: {
            location: {
              id: "L1",
              descriptor: {
                name: "ABC Store",
              },
              gps: "19.129076,72.825803",
              address: {
                building: "my building name or house",
                city: "Mumbai",
                state: "Maharashtra",
                country: "IND",
                area_code: "400053",
                locality: "my street name",
                name: "my house or door or floor",
              },
            },
            contact: {
              phone: "9594663710",
              email: "nobody@nomail.com",
            },
          },
          end: f.end,
        };
      });
  }
  if (action === "on_status") {
    console.log("######## createFulfillments on_status #########");
    let fulfillments = sessionData.fulfillments as Fulfillments;
    const tags = {
      tags: [
        {
          code: "routing",
          list: [
            {
              code: "type",
              value: "P2P",
            },
          ],
        },
        {
          code: "tracking",
          list: [
            {
              code: "gps_enabled",
              value: "no",
            },
            {
              code: "url_enabled",
              value: "yes",
            },
            {
              code: "url",
              value: "https://sellerNP.com/ondc/tracking_url",
            },
          ],
        },
      ],
    };
    let finalFulfillments = sessionData.on_status_fulfillments as Fulfillments;
    if (sessionData.on_status_fulfillments.length <= 0) {
      const time = new Date(new Date().getTime() + 10 * 1000 * 60);
      const start_end = new Date(time.getTime() + 10 * 1000 * 60).toISOString();
      finalFulfillments = fulfillments
        // .filter((f) => f.type == "Delivery")
        .map((f) => {
          if (f.type == "Delivery") {
            return {
              ...f,
              start: {
                ...f.start,
                time: {
                  range: {
                    start: time.toISOString(),
                    end: start_end,
                  },
                },
              },
              end: {
                ...f.end,
                time: {
                  range: {
                    start: start_end,
                    end: new Date(
                      time.getTime() +
                        1000 * isoDurToSec(f["@ondc/org/TAT"] || "PT0H")
                    ).toISOString(),
                  },
                },
              },
              tags: tags.tags,
            };
          }
          return f;
        });
    }
    let state = "Pending";
    switch (actionId) {
      case "on_status_packed":
        state = "Packed";
        break;
      case "on_status_accepted":
        state = "Pending";
        break;
      case "on_status_agent_assigned":
        state = "Agent-assigned";
        break;
      case "on_status_picked":
        state = "Order-picked-up";
        finalFulfillments = finalFulfillments.map((f) => {
          if (f.type === "Delivery") {
            return {
              ...f,
              start: {
                ...f.start,
                time: {
                  ...f.start?.time,
                  timestamp: new Date().toISOString(),
                },
              },
            };
          }
          return f;
        });
        break;
      case "on_status_out_for_delivery":
        state = "Out-for-delivery";
        break;
      case "on_status_order_delivered":
        state = "Order-delivered";
        finalFulfillments = finalFulfillments.map((f) => {
          if (f.type === "Delivery") {
            return {
              ...f,
              end: {
                ...f.end,
                time: {
                  ...f.end?.time,
                  timestamp: new Date().toISOString(),
                },
              },
            };
          }
          return f;
        });
        break;
      case "on_status_rto_delivered":
        state = "Cancelled";
      case "on_status_ready_to_ship":
        state = "Packed";
        finalFulfillments = finalFulfillments.map((f) => {
          if (f.type === "Buyer-Delivery") {
            const tags = f.tags || [];
            return {
              ...f,
              tags: [
                ...tags,
                {
                  code: "state",
                  list: [
                    {
                      code: "ready_to_ship",
                      value: "yes",
                    },
                  ],
                },
                {
                  code: "routing",
                  list: [
                    {
                      code: "type",
                      value: "P2P",
                    },
                  ],
                },
              ],
            };
          }
          return f;
        });
        break;

      default:
        break;
    }
    finalFulfillments = finalFulfillments.map((f) => {
      if (f.type === "Delivery") {
        return {
          ...f,
          state: {
            descriptor: {
              code: state,
            },
          },
        };
      }
      return f;
    });
    return finalFulfillments;
  }
  if (action === "on_status_rep") {
    console.log("######## createFulfillments on_status #########");
    let fulfillments = sessionData.fulfillments as Fulfillments;
    const tags = {
      tags: [
        {
          code: "routing",
          list: [
            {
              code: "type",
              value: "P2P",
            },
          ],
        },
        {
          code: "tracking",
          list: [
            {
              code: "gps_enabled",
              value: "no",
            },
            {
              code: "url_enabled",
              value: "yes",
            },
            {
              code: "url",
              value: "https://sellerNP.com/ondc/tracking_url",
            },
          ],
        },
      ],
    };
    let finalFulfillments = sessionData.on_status_fulfillments as Fulfillments;
    if (sessionData.on_status_fulfillments.length <= 0) {
      const time = new Date(new Date().getTime() + 10 * 1000 * 60);
      const start_end = new Date(time.getTime() + 10 * 1000 * 60).toISOString();
      finalFulfillments = fulfillments
        // .filter((f) => f.type == "Delivery")
        .map((f) => {
          if (f.type == "Delivery") {
            return {
              ...f,
              start: {
                ...f.start,
                time: {
                  range: {
                    start: time.toISOString(),
                    end: start_end,
                  },
                },
              },
              end: {
                ...f.end,
                time: {
                  range: {
                    start: start_end,
                    end: new Date(
                      time.getTime() +
                        1000 * isoDurToSec(f["@ondc/org/TAT"] || "PT0H")
                    ).toISOString(),
                  },
                },
              },
              tags: tags.tags,
            };
          }
          return f;
        });
    }
    let state = "Pending";
    switch (actionId) {
      case "on_status_packed":
        state = "Packed";
        break;
      case "on_status_accepted":
        state = "Pending";
        break;
      case "on_status_agent_assigned":
        state = "Agent-assigned";
        break;
      case "on_status_picked":
        state = "Order-picked-up";
        finalFulfillments = finalFulfillments.map((f) => {
          if (f.type === "Delivery") {
            return {
              ...f,
              start: {
                ...f.start,
                time: {
                  ...f.start?.time,
                  timestamp: new Date().toISOString(),
                },
              },
            };
          }
          return f;
        });
        break;
      case "on_status_out_for_delivery":
        state = "Out-for-delivery";
        break;
      case "on_status_order_delivered":
        state = "Order-delivered";
        finalFulfillments = finalFulfillments.map((f) => {
          if (f.type === "Delivery") {
            return {
              ...f,
              end: {
                ...f.end,
                time: {
                  ...f.end?.time,
                  timestamp: new Date().toISOString(),
                },
              },
            };
          }
          return f;
        });
        break;
      case "on_status_rto_delivered":
        state = "Cancelled";
      case "on_status_ready_to_ship":
        state = "Packed";
        finalFulfillments = finalFulfillments.map((f) => {
          if (f.type === "Buyer-Delivery") {
            const tags = f.tags || [];
            return {
              ...f,
              tags: [
                ...tags,
                {
                  code: "state",
                  list: [
                    {
                      code: "ready_to_ship",
                      value: "yes",
                    },
                  ],
                },
                {
                  code: "routing",
                  list: [
                    {
                      code: "type",
                      value: "P2P",
                    },
                  ],
                },
              ],
            };
          }
          return f;
        });
        break;

      default:
        break;
    }
    finalFulfillments = finalFulfillments.map((f) => {
      if (f.type === "Delivery") {
        return {
          ...f,
          state: {
            descriptor: {
              code: state,
            },
          },
        };
      }
      return f;
    });
    return finalFulfillments;
  }
  return defaultFulfillments;
}
