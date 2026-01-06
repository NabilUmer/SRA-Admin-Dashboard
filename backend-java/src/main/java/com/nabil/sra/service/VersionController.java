package com.nabil.sra;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class VersionController {
  @Value("${app.version:unknown}")
  private String version;

  @GetMapping("/version")
  public Map<String,String> version() { return Map.of("version", version); }
}
