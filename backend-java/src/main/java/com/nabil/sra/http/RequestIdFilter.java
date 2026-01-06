package com.nabil.sra.http;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.UUID;

@Component
public class RequestIdFilter implements Filter {
  public static final String HEADER = "X-Request-Id";
  @Override public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    String rid = req.getHeader(HEADER);
    if (rid == null || rid.isBlank()) rid = UUID.randomUUID().toString();
    MDC.put("rid", rid);
    try { chain.doFilter(request, response); }
    finally { MDC.remove("rid"); }
  }
}
