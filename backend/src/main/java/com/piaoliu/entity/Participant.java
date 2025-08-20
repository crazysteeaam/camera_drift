package com.piaoliu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "participants")
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 200)
    private String location;

    @Column(length = 500)
    private String bio;

    @Column(name = "join_date")
    private LocalDateTime joinDate;

    @Column(name = "relay_order")
    private Integer relayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;

    @OneToMany(mappedBy = "participant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Photo> photos;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // 默认构造函数
    public Participant() {
    }

    public Participant(String name, String location, Group group) {
        this.name = name;
        this.location = location;
        this.group = group;
        this.joinDate = LocalDateTime.now();
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public LocalDateTime getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDateTime joinDate) {
        this.joinDate = joinDate;
    }

    public Integer getRelayOrder() {
        return relayOrder;
    }

    public void setRelayOrder(Integer relayOrder) {
        this.relayOrder = relayOrder;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public List<Photo> getPhotos() {
        return photos;
    }

    public void setPhotos(List<Photo> photos) {
        this.photos = photos;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}