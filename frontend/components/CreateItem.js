import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from 'next/router';
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from './ErrorMessage';

const CreateItem = () => {
  const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
      $title: String!
      $description: String!
      $price: Int!
      $image: String
      $largeImage: String
    ) {
      createItem(
        title: $title
        description: $description
        price: $price
        image: $image
        largeImage: $largeImage
      ) {
        id
      }
    }
  `;

  const [state, setState] = useState({
    title: "Cool Shoes",
    description: "Love those dude",
    image: "",
    largeImage: "",
    price: 1000,
  });

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    // remember to spread prevState and then add your updates to state
    setState((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

   const uploadFile = async (e) => {
    console.log('uploading file');
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sick-fits');

    const res = await fetch (
      'https://api.cloudinary.com/v1_1/dinw8ffby/image/upload', {
        method: 'POST',
        body: data
      }
    );
    const file = await res.json();
    console.log(file);
    setState(prevState => ({
      ...prevState,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    }))
  }

  return (
    <Mutation mutation={CREATE_ITEM_MUTATION} variables={state}>
      {(createItem, { loading, error }) => (
        <Form
          onSubmit={async (e) => {
            // stop form from submitted
            e.preventDefault();
            // call mutation
            const res = await createItem();
            // change page to single item page
            console.log(res);
            Router.push({
              pathname: "/item",
              query: { id: res.data.createItem.id },
            });
          }}
        >
          <Error error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              Image
              <input
                type="file"
                id="file"
                name="file"
                placeholder="Upload on image"
                required
                onChange={uploadFile}
              />
              {state.image && <img src={state.image} alt="upload preview"/>}
            </label>
            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                required
                value={state.title}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="price">
              Price
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Price"
                required
                value={state.price}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="description">
              Price
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                required
                value={state.description}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default CreateItem;
export { CREATE_ITEM_MUTATION };
