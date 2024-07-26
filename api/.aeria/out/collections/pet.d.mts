import { Collection,SchemaWithId,ExtendCollection,get,getAll,insert,upload } from "aeria"

export declare type petCollection = {description: {$id: "pet",properties: {name: {type: "string"},type: {enum: ["dog","cat"]},picture: {$ref: "file",accept: ["image/*"]}},icon: "dog",presets: ["crud"],indexes: ["name"]},functions: {get: typeof get,getAll: typeof getAll,insert: typeof insert,upload: typeof upload},exposedFunctions: {get: true,getAll: true,insert: true,upload: true}}
export declare const pet: petCollection & {item: SchemaWithId<petCollection["description"]>}
export declare type Pet = SchemaWithId<typeof pet.description>
export declare const extendPetCollection: <const TCollection extends { [P in keyof Collection]?: Partial<Collection[P]> }>(collection: TCollection) => ExtendCollection<typeof pet,TCollection>
