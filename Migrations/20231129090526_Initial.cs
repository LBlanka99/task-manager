using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GroupModel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupModel", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TagModel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    Color = table.Column<string>(type: "TEXT", nullable: false),
                    GroupId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagModel", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TagModel_GroupModel_GroupId",
                        column: x => x.GroupId,
                        principalTable: "GroupModel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TaskModel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Deadline = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    Points = table.Column<int>(type: "INTEGER", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    ConfirmingPhoto = table.Column<string>(type: "TEXT", nullable: true),
                    GroupModelId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskModel", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskModel_GroupModel_GroupModelId",
                        column: x => x.GroupModelId,
                        principalTable: "GroupModel",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserModel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserName = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: true),
                    Password = table.Column<string>(type: "TEXT", nullable: false),
                    ProfilePicture = table.Column<string>(type: "TEXT", nullable: true),
                    GroupId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Roles = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserModel", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserModel_GroupModel_GroupId",
                        column: x => x.GroupId,
                        principalTable: "GroupModel",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TagModelTaskModel",
                columns: table => new
                {
                    TagsId = table.Column<Guid>(type: "TEXT", nullable: false),
                    TaskModelId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagModelTaskModel", x => new { x.TagsId, x.TaskModelId });
                    table.ForeignKey(
                        name: "FK_TagModelTaskModel_TagModel_TagsId",
                        column: x => x.TagsId,
                        principalTable: "TagModel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TagModelTaskModel_TaskModel_TaskModelId",
                        column: x => x.TaskModelId,
                        principalTable: "TaskModel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TaskModelUserModel",
                columns: table => new
                {
                    AssigneesId = table.Column<Guid>(type: "TEXT", nullable: false),
                    TaskModelId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskModelUserModel", x => new { x.AssigneesId, x.TaskModelId });
                    table.ForeignKey(
                        name: "FK_TaskModelUserModel_TaskModel_TaskModelId",
                        column: x => x.TaskModelId,
                        principalTable: "TaskModel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TaskModelUserModel_UserModel_AssigneesId",
                        column: x => x.AssigneesId,
                        principalTable: "UserModel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TagModel_GroupId",
                table: "TagModel",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_TagModelTaskModel_TaskModelId",
                table: "TagModelTaskModel",
                column: "TaskModelId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskModel_GroupModelId",
                table: "TaskModel",
                column: "GroupModelId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskModelUserModel_TaskModelId",
                table: "TaskModelUserModel",
                column: "TaskModelId");

            migrationBuilder.CreateIndex(
                name: "IX_UserModel_GroupId",
                table: "UserModel",
                column: "GroupId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TagModelTaskModel");

            migrationBuilder.DropTable(
                name: "TaskModelUserModel");

            migrationBuilder.DropTable(
                name: "TagModel");

            migrationBuilder.DropTable(
                name: "TaskModel");

            migrationBuilder.DropTable(
                name: "UserModel");

            migrationBuilder.DropTable(
                name: "GroupModel");
        }
    }
}
