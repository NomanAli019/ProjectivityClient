// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: "/", // when user visits /
        destination: "/dashboard/home", // redirect here
        permanent: true, // 308 redirect (good for SEO)
      },
    ];
  },
};
