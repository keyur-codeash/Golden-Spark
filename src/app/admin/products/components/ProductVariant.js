import React from 'react'
import { FieldArray } from "formik";


function ProductVariant() {
 const form ={
    values: {variants :[
  { size: "S", color: "Red", stock: 10 },
  { size: "M", color: "Blue", stock: 5 },
]
} }  

  return (
<div className="mb-4">
  <h3 className="font-medium mb-2">Product Variants</h3>
  <FieldArray name="variants">
    {({ push, remove, form }) => (
      <div>
        {form.values.variants && form.values.variants.length > 0 ? (
          form.values.variants.map((variant, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-2 mb-2 items-end"
            >
              {/* Size */}
              <div>
                <Field
                  name={`variants[${index}].size`}
                  placeholder="Size"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Color */}
              <div>
                <Field
                  name={`variants[${index}].color`}
                  placeholder="Color"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Stock */}
              <div>
                <Field
                  name={`variants[${index}].stock`}
                  type="number"
                  placeholder="Stock"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Remove Button */}
              <div>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mb-2">No variants added yet.</p>
        )}

        <button
          type="button"
          onClick={() => push({ size: "", color: "", stock: 0 })}
          className="px-4 py-2 bg-yellow-800 text-white rounded"
        >
          Add Variant
        </button>
      </div>
    )}
  </FieldArray>
</div>
  )
}

export default ProductVariant