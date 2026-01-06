package com.nabil.sra.dto;
public class PatchResourceRequest {
    private String name;
    private Boolean active;
    private Integer quantity;
    private Long version;
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
