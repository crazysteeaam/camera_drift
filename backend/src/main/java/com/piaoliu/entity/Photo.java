package com.piaoliu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "taken_date")
    private LocalDateTime takenDate;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @Column(name = "photo_order")
    private Integer photoOrder;

    @Column(length = 100)
    private String camera;

    @Column(length = 100)
    private String film;

    @Column(length = 100)
    private String location;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    // 默认构造函数
    public Photo() {
    }

    public Photo(String imageUrl, String title, Participant participant) {
        this.imageUrl = imageUrl;
        this.title = title;
        this.participant = participant;
        this.uploadDate = LocalDateTime.now();
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getTakenDate() {
        return takenDate;
    }

    public void setTakenDate(LocalDateTime takenDate) {
        this.takenDate = takenDate;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public Participant getParticipant() {
        return participant;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public Integer getPhotoOrder() {
        return photoOrder;
    }

    public void setPhotoOrder(Integer photoOrder) {
        this.photoOrder = photoOrder;
    }

    public String getCamera() {
        return camera;
    }

    public void setCamera(String camera) {
        this.camera = camera;
    }

    public String getFilm() {
        return film;
    }

    public void setFilm(String film) {
        this.film = film;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }
}