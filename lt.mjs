import localtunnel from 'localtunnel';

(async () => {
  const tunnel = await localtunnel({ port: 3000, subdomain: 'asador123' });
  console.log(`Your public URL: ${tunnel.url}`);
  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
})();
