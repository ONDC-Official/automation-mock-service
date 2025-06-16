type Location = {
    gps: string;
    id?: string;
  };
  
  type Vehicle = {
    category: string;
    variant: string;
  };
  
  type Stop = {
    type: string;
    location: Location;
    instructions?: {
      short_desc: string;
      long_desc: string;
    };
  };
  
  type Fulfillment = {
    id: string;
    type: string;
    stops: Stop[];
    vehicle: Vehicle;
  };
  
  function createFulfillments(startLocation: string, endLocation: string): Fulfillment[] {
    return [
      {
        id: "F1",
        type: "DELIVERY",
        stops: [
          {
            type: "START",
            location: {
              gps: startLocation
            },
            instructions: {
              short_desc: "short description of the location",
              long_desc: "long description of the location"
            }
          },
          {
            type: "END",
            location: {
              gps: endLocation
            }
          }
        ],
        vehicle: {
          category: "AUTO_RICKSHAW",
          variant: "AUTO_RICKSHAW"
        }
      },
      {
        id: "F2",
        type: "DELIVERY",
        stops: [
          {
            type: "START",
            location: {
              gps: startLocation
            },
            instructions: {
              short_desc: "short description of the location",
              long_desc: "long description of the location"
            }
          },
          {
            type: "END",
            location: {
              gps: endLocation
            }
          }
        ],
        vehicle: {
          category: "CAB",
          variant: "SEDAN"
        }
      }
    ];
  }
  
  function calculatePrice(distance: number, vehicleCategory: string): {
    value: string;
    minimum_value: string;
    maximum_value: string;
  } {
    let basePrice = vehicleCategory === "AUTO_RICKSHAW" ? 146 : 206;
    let variance = vehicleCategory === "AUTO_RICKSHAW" ? 30 : 40;
    
    return {
      value: basePrice.toString(),
      minimum_value: (basePrice - variance).toString(),
      maximum_value: (basePrice + variance).toString()
    };
  }
  
  export async function onSearchGenerator(
    existingPayload: any,
    sessionData: any
  ) {
    try {
      const { start_location, end_location } = sessionData;
      
      if (!start_location || !end_location) {
        throw new Error("Start and End locations are required");
      }
  
      // Create fulfillments with the provided locations
      const fulfillments = createFulfillments(start_location, end_location);
      existingPayload.message.catalog.providers[0].fulfillments = fulfillments;
  
      // Update items with new prices
      existingPayload.message.catalog.providers[0].items = 
        existingPayload.message.catalog.providers[0].items.map((item: any, index: number) => {
          const vehicleCategory = index === 0 ? "AUTO_RICKSHAW" : "CAB";
          const price = calculatePrice(0, vehicleCategory); // Distance calculation can be added if needed
          return {
            ...item,
            price: {
              currency: "INR",
              ...price
            }
          };
        });
  
      return existingPayload;
    } catch (err) {
      console.error(err);
      delete existingPayload.message;
      const errorMessage = {
        code: "30001",
        message: "Invalid request error. Location coordinates are required."
      };
      existingPayload.error = errorMessage;
      return existingPayload;
    }
  }