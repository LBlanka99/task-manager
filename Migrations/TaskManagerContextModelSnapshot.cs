﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TaskManager.Entities.Models.Context;

#nullable disable

namespace TaskManager.Migrations
{
    [DbContext(typeof(TaskManagerContext))]
    partial class TaskManagerContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.0");

            modelBuilder.Entity("TagModelTaskModel", b =>
                {
                    b.Property<Guid>("TagsId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("TaskModelId")
                        .HasColumnType("TEXT");

                    b.HasKey("TagsId", "TaskModelId");

                    b.HasIndex("TaskModelId");

                    b.ToTable("TagModelTaskModel");
                });

            modelBuilder.Entity("TaskManager.Entities.Models.GroupModel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("GroupModel");
                });

            modelBuilder.Entity("TaskManager.Entities.Models.TagModel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("GroupModelId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("GroupModelId");

                    b.ToTable("TagModel");
                });

            modelBuilder.Entity("TaskManager.Entities.Models.TaskModel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("ConfirmingPhoto")
                        .HasColumnType("TEXT");

                    b.Property<DateOnly>("Deadline")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("GroupModelId")
                        .HasColumnType("TEXT");

                    b.Property<int>("Points")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Status")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("GroupModelId");

                    b.ToTable("TaskModel");
                });

            modelBuilder.Entity("TaskManager.Entities.Models.UserModel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("GroupModelId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Points")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ProfilColor")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("ProfilePicture")
                        .HasColumnType("TEXT");

                    b.Property<string>("Roles")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("GroupModelId");

                    b.ToTable("UserModel");
                });

            modelBuilder.Entity("TaskModelUserModel", b =>
                {
                    b.Property<Guid>("AssigneesId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("TaskModelId")
                        .HasColumnType("TEXT");

                    b.HasKey("AssigneesId", "TaskModelId");

                    b.HasIndex("TaskModelId");

                    b.ToTable("TaskModelUserModel");
                });

            modelBuilder.Entity("TagModelTaskModel", b =>
                {
                    b.HasOne("TaskManager.Entities.Models.TagModel", null)
                        .WithMany()
                        .HasForeignKey("TagsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TaskManager.Entities.Models.TaskModel", null)
                        .WithMany()
                        .HasForeignKey("TaskModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TaskManager.Entities.Models.TagModel", b =>
                {
                    b.HasOne("TaskManager.Entities.Models.GroupModel", null)
                        .WithMany("Tags")
                        .HasForeignKey("GroupModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TaskManager.Entities.Models.TaskModel", b =>
                {
                    b.HasOne("TaskManager.Entities.Models.GroupModel", null)
                        .WithMany("Tasks")
                        .HasForeignKey("GroupModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TaskManager.Entities.Models.UserModel", b =>
                {
                    b.HasOne("TaskManager.Entities.Models.GroupModel", null)
                        .WithMany("Members")
                        .HasForeignKey("GroupModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TaskModelUserModel", b =>
                {
                    b.HasOne("TaskManager.Entities.Models.UserModel", null)
                        .WithMany()
                        .HasForeignKey("AssigneesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TaskManager.Entities.Models.TaskModel", null)
                        .WithMany()
                        .HasForeignKey("TaskModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TaskManager.Entities.Models.GroupModel", b =>
                {
                    b.Navigation("Members");

                    b.Navigation("Tags");

                    b.Navigation("Tasks");
                });
#pragma warning restore 612, 618
        }
    }
}
