package com.nabil.sra;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class HealthIntegrationTest {
  @LocalServerPort int port;
  @Autowired TestRestTemplate rest;

  @Test void health_ok() {
    var body = rest.getForObject("http://localhost:" + port + "/health", String.class);
    assertThat(body).contains("ok");
  }
}
