export const onRequest = async (context, next) => {
  const { request, url, logger } = context;
  const response = await next();
  const html = await response.text();
  const escapes = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&#39;": "'",
    "&quot;": '"',
  };

  console.log("");
  const replaced = html.replace(/ECR%([\s\S]*?)%ECR/g, (match, captured) => {
    captured = captured.replace(/&amp;|&lt;|&gt;|&#39;|&quot;/g, (tag) => escapes[tag]);

    const ecr_code = `<%${captured}%>`;
    logger.info(`Unescaped in ${url.pathname}: "${match}" → "${ecr_code}"`);

    return ecr_code;
  });

  return new Response(replaced, response);
};
