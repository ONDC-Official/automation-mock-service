export interface Quote {
	/**
	 * Describes the price of an item. Allows for domain extension.
	 */
	price?: {
		/**
		 * ISO 4217 alphabetic currency code e.g. 'INR'
		 */
		currency?: string;
		/**
		 * Describes a decimal value
		 */
		value?: string;
		/**
		 * A collection of tag objects with group level attributes. For detailed documentation on the Tags and Tag Groups schema go to https://github.com/beckn/protocol-specifications/discussions/316
		 */
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
		};
		[k: string]: unknown;
	};
	breakup?: {
		/**
		 * This is the most unique identifier of a service item. An example of an Item ID could be the SKU of a product.
		 */
		"@ondc/org/item_id"?: string;
		"@ondc/org/item_quantity"?: {
			count?: number;
			[k: string]: unknown;
		};
		"@ondc/org/title_type"?: string;
		item?: {
			quantity?: {
				available?: {
					count?: string;
					[k: string]: unknown;
				};
				maximum?: {
					count?: string;
					[k: string]: unknown;
				};
				[k: string]: unknown;
			};
			/**
			 * This is the most unique identifier of a service item. An example of an Item ID could be the SKU of a product.
			 */
			parent_item_id?: string;
			/**
			 * Describes the price of an item. Allows for domain extension.
			 */
			price?: {
				/**
				 * ISO 4217 alphabetic currency code e.g. 'INR'
				 */
				currency?: string;
				/**
				 * Describes a decimal value
				 */
				value?: string;
				/**
				 * A collection of tag objects with group level attributes. For detailed documentation on the Tags and Tag Groups schema go to https://github.com/beckn/protocol-specifications/discussions/316
				 */
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
		title?: string;
		/**
		 * Describes the price of an item. Allows for domain extension.
		 */
		price?: {
			/**
			 * ISO 4217 alphabetic currency code e.g. 'INR'
			 */
			currency?: string;
			/**
			 * Describes a decimal value
			 */
			value?: string;
			/**
			 * A collection of tag objects with group level attributes. For detailed documentation on the Tags and Tag Groups schema go to https://github.com/beckn/protocol-specifications/discussions/316
			 */
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
			};
			[k: string]: unknown;
		};
		/**
		 * Describes duration as per ISO8601 format
		 */
		ttl?: string;
		[k: string]: unknown;
	}[];
	/**
	 * Validity of quote in ISO8601 durations format after which it has to be refreshed e.g. 'P7D' indicates validity of 7 days; value of 0 indicates quote is not cacheable
	 */
	ttl?: string;
	[k: string]: unknown;
}
