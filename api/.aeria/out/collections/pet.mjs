import { extendCollection,defineCollection,get,getAll,insert,upload } from "aeria"

export const pet = defineCollection({description: {$id: "pet",properties: {name: {type: "string"},type: {enum: ["dog","cat"]},picture: {$ref: "file",accept: ["image/*"]}},icon: "dog",presets: ["crud"],indexes: ["name"]},functions: {get,getAll,insert,upload},exposedFunctions: {get: true,getAll: true,insert: true,upload: true}})
export const extendPetCollection = (collection) => extendCollection(pet,collection)
