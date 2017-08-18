
export default ({ body, title}) => {
  return `
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <meta name="description" content="Web-based book trading application.">
        <link id="favicon" rel="icon" href="https://cdn.glitch.com/f0a70106-eee3-44ca-abf0-7ae97fb8b0a6%2FBooks.ico?1502580688625" type="image/x-icon">
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet prefetch" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">

        <link rel="stylesheet" href="/css/login_style.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

      </head>
      <body>
        <div id="root">${body}</div>
        <script src="/static/login.bundle.js"></script>
      </body>
    </html>
  `;
};