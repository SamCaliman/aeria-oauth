import { Collection,SchemaWithId,ExtendCollection,get,getAll,insert } from "aeria"
export declare type personCollection = {description: {$id: "person",properties: {name: {type: "string"},pets: {type: "array",items: {$ref: "pet"}}},icon: "person",presets: ["crud"]},functions: {get: typeof get,getAll: typeof getAll,insert: typeof insert},exposedFunctions: {get: true,getAll: true,insert: true}}
export declare const person: personCollection & {item: SchemaWithId<personCollection['description']>}
export declare type Person = SchemaWithId<typeof person.description>
export declare const extendPersonCollection: <const TCollection extends { [P in keyof Collection]?: Partial<Collection[P]> }>(collection: TCollection) => ExtendCollection<typeof person,TCollection>
