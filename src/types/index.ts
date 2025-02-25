/**
 * Represents a Strapi attribute with various possible types and configurations.
 */
export interface StrapiAttribute {
  /**
   * The type of the attribute.
   */
  type:
    | 'string'
    | 'text'
    | 'richtext'
    | 'integer'
    | 'float'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'json'
    | 'enumeration'
    | 'relation'
    | 'component'
    | 'dynamiczone'
    | 'media'
    | 'uid'
    | 'customField';

  /**
   * Indicates if the attribute is required.
   * @optional
   */
  required?: boolean;

  /**
   * Enumeration values for the attribute.
   * @optional
   */
  enum?: string[];

  /**
   * The type of relation for the attribute.
   * @optional
   */
  relation?: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany';

  /**
   * The target model for relations, e.g., 'api::article.article'.
   * @optional
   */
  target?: string;

  /**
   * The component name, e.g., 'shared.seo'.
   * @optional
   */
  component?: string;

  /**
   * Indicates if the component or dynamic zone is repeatable.
   * @optional
   */
  repeatable?: boolean;

  /**
   * Components for dynamic zones.
   * @optional
   */
  components?: string[];

  /**
   * The display name of the field.
   * @optional
   */
  displayName?: string;

  /**
   * The description of the field.
   * @optional
   */
  description?: string;

  /**
   * Plugin-specific options.
   * @optional
   */
  pluginOptions?: Record<string, any>;

  /**
   * Regex pattern for string fields.
   * @optional
   */
  regex?: string;

  /**
   * Indicates if the attribute has a unique constraint.
   * @optional
   */
  unique?: boolean;

  /**
   * The target field for UID.
   * @optional
   */
  targetField?: string;

  /**
   * The inversed by relation.
   * @optional
   */
  inversedBy?: string;

  /**
   * The minimum value for integer fields.
   * @optional
   */
  min?: number;

  /**
   * The default value of the attribute.
   * @optional
   */
  default?: any;

  /**
   * Indicates if the media field allows multiple values.
   * @optional
   */
  multiple?: boolean;

  /**
   * Allowed media types for the attribute.
   * @optional
   */
  allowedTypes?: string[];

  /**
   * Custom field type.
   * @optional
   */
  customField?: string;

  /**
   * Options for custom fields.
   * @optional
   */
  options?: Record<string, any>;
}

/**
 * Represents a group of Strapi attributes.
 */
export interface StrapiAttributeGroup {
  [fieldName: string]: StrapiAttribute;
}

/**
 * Represents a Strapi model definition.
 */
export interface StrapiModel {
  /**
   * The type of the model.
   * @type {'collectionType' | 'singleType' | 'component'}
   */
  kind: 'collectionType' | 'singleType' | 'component';

  /**
   * The name of the collection, e.g., 'articles'.
   * @type {string}
   * @optional
   */
  collectionName?: string;

  /**
   * Information about the model.
   */
  info: {
    /**
     * The singular name of the model.
     * @type {string}
     * @optional
     */
    singularName?: string;

    /**
     * The plural name of the model.
     * @type {string}
     * @optional
     */
    pluralName?: string;

    /**
     * The display name of the model.
     * @type {string}
     */
    displayName: string;

    /**
     * The description of the model.
     * @type {string}
     * @optional
     */
    description?: string;

    /**
     * The icon for the model.
     * @type {string}
     * @optional
     */
    icon?: string;
  };

  /**
   * Options for the model.
   */
  options?: {
    /**
     * Indicates if the draft and publish option is enabled.
     * @type {boolean}
     * @optional
     */
    draftAndPublish?: boolean;
  };

  /**
   * Plugin-specific options.
   * @type {Record<string, any>}
   * @optional
   */
  pluginOptions?: Record<string, any>;

  /**
   * The attributes of the model.
   * @type {StrapiAttributeGroup}
   */
  attributes: StrapiAttributeGroup;
}
