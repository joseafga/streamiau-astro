export const onRequest = async (context, next) => {
  const { request, url, logger } = context;
  const response = await next();
  const html = await response.text();
  const ECR_PATTERN = /("|&quot;)?ECR?%([\s\S]*?)%ECR(:n)?("|&quot;)?/g;
  const TAG_ESCAPES = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&#39;": "'",
    "&quot;": '"',
  };

  const replaced = html.replace(ECR_PATTERN, (match, quotBegin, captured, opts, quotEnd) => {
    captured = captured.replace(/&amp;|&lt;|&gt;|&#39;|&quot;/g, (tag) => TAG_ESCAPES[tag]);

    // :n => number ECR will remove quotes
    const ecr_code = opts === ":n" ? `<%${captured}%>` : `${quotBegin ?? ""}<%${captured}%>${quotEnd ?? ""}`;
    logger.info(`Unescaped in ${url.pathname}: '${match}' → '${ecr_code}'`);

    return ecr_code;
  });

  return new Response(replaced, response);
};
