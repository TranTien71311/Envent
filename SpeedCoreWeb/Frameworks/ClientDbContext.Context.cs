﻿//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SpeedCoreWeb.Frameworks
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class ClientDbContext : DbContext
    {
        public ClientDbContext()
            : base("name=ClientDbContext")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public DbSet<Company> Companies { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Sector> Sectors { get; set; }
    }
}