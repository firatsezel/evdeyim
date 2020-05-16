export default async function receiveuser() {
    let data = {};
    await fetch(`http://37.148.212.44:8080/receiveuser?purpose=up`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then((responseJson) => {
      data = responseJson;
    },
        ).catch((err) => {
          console.log('Fetch Err', err);
        });
    return data;
  }