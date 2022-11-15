const AWS = require("aws-sdk");
const { v4 } = require("uuid");
const axios = require("axios");

const docClient = new AWS.DynamoDB.DocumentClient();
const headers = {
  "content-type": "application/json",
};

const tableName = "ProductsTable";

export const helloWorld = async (evt) => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      hello: "Reto Tecnico Rimac",
    }),
  };
};

export const saveProduct = async (evt) => {
  try {
    const { id, name, price } = JSON.parse(evt.body);

    let currentDate = new Date();

    let newProduct = {
      id: id ? id : v4(),
      name,
      price,
      created_at: currentDate,
    };

    if (id) {
      newProduct["updated_at"] = currentDate;
    }

    await docClient
      .put({
        TableName: tableName,
        Item: newProduct,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: newProduct,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Error",
      }),
    };
  }
};

export const productList = async (evt) => {
  try {
    const results = await docClient
      .scan({
        TableName: tableName,
      })
      .promise();

    const products = results.Items;

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: products,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Error",
      }),
    };
  }
};

export const findProduct = async (evt) => {
  try {
    const id = evt.pathParameters?.id;

    const results = await docClient
      .get({
        TableName: tableName,
        Key: {
          id,
        },
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: results.Item,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Algo salio mal, por favor, comuniquese con soporte",
      }),
    };
  }
};

export const deleteProduct = async (evt) => {
  try {
    const id = evt.pathParameters?.id;

    await docClient
      .delete({
        TableName: tableName,
        Key: {
          id,
        },
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: "Producto eliminado satisfactoriamente",
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Error al eliminar un producto, comuniquese con soporte",
      }),
    };
  }
};

const dictNamesTrans = (dictionType, key) => {
  const list1 = {
    name: "nombre",
    rotation_period: "periodo_rotacion",
    orbital_period: "periodo_orbital",
    diameter: "diametro",
    climate: "clima",
    gravity: "gravedad",
    terrain: "terreno",
    surface_water: "superficie_agua",
    population: "poblacion",
    residents: "residentes",
    films: "peliculas",
    created: "creado",
    edited: "editado",
    url: "enlace",
  };
  const list2 = {
    name: "nombre",
    model: "modelo",
    manufacturer: "fabricante",
    cost_in_credits: "costo",
    length: "longitud",
    max_atmosphering_speed: "velocidad_atmosferica_maxima",
    crew: "tripulacion",
    passengers: "pasajeros",
    cargo_capacity: "capacidad_cargo",
    consumables: "consumibles",
    vehicle_class: "clase_vehiculo",
    pilots: "pilotos",
    films: "peliculas",
    created: "creado",
    edited: "editado",
    url: "enlace",
  };

  if (dictionType == 0) {
    return list1[key];
  } else {
    return list2[key];
  }
};

export const swPlanets = async (evt) => {
  try {
    const response = await axios.get("https://swapi.py4e.com/api/planets");
    const data = await response.data;

    const planets = data.results;

    let newArr = [];

    for (let i = 0; i < planets.length; i++) {
      let newObj = {};
      Object.keys(planets[i]).map((key) => {
        newObj[dictNamesTrans(0, key)] = planets[i][key];
      });
      newArr.push(newObj);
    }

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: newArr,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Error",
      }),
    };
  }
};

export const swVehicles = async (evt) => {
  try {
    const response = await axios.get("https://swapi.py4e.com/api/vehicles");
    const data = await response.data;

    const vehicles = data.results;

    let newArr = [];

    for (let i = 0; i < vehicles.length; i++) {
      let newObj = {};
      Object.keys(vehicles[i]).map((key) => {
        newObj[dictNamesTrans(1, key)] = vehicles[i][key];
      });
      newArr.push(newObj);
    }

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: newArr,
      }),
    };
  } catch (e) {
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Error",
      }),
    };
  }
};
