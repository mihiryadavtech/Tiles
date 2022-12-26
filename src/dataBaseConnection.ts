import { DataSource } from 'typeorm';
import { Admin } from './entities/Admin.entity';
import { AreaType } from './entities/AreaType.entity';
import { Attributes } from './entities/Attributes.entity';
import { AttributesValues } from './entities/AttributesValues.entity';
import { Banners } from './entities/Banners.entity';
import { BookmarkedCatalogue } from './entities/BookmarkedCatalogue.entity';
import { Catalogue } from './entities/Catalogue.entity';
import { CatalogueSizes } from './entities/CatalogueSizes.entity';
import { CatalogueViewer } from './entities/CatalogueViewer.entity';
import { Category } from './entities/Category.entity';
import { CategorySize } from './entities/CategorySize.entity';
import { CategoryUnit } from './entities/CategoryUnit.entity';
import { Collection } from './entities/Collection.entity';
import { CollectionCategory } from './entities/CollectionCategory.entity';
import { Company } from './entities/Company.entity';
import { CompanyDealingCategory } from './entities/CompanyDealingCategory.entity';
import { CompanyUser } from './entities/CompanyUser.entity';
import { CompanyViewCount } from './entities/CompanyViewCount.entity';
import { Contact } from './entities/Contact.entity';
import { Features } from './entities/Features.entity';
import { Followers } from './entities/Followers.entity';
import { Grade } from './entities/Grade.entity';
import { Inquiries } from './entities/Inquiries.entity';
import { LikePosts } from './entities/LikePosts.entity';
import { Package } from './entities/Package.entity';
import { PackageFeatures } from './entities/PackageFeatures.entity';
import { Post } from './entities/Post.entity';
import { PostFeatures } from './entities/PostFeatures.entity';
import { PostViewer } from './entities/PostViewer.entity';
import { PrivateCataloguePermission } from './entities/PrivateCataloguePermission.entity';
import { Product } from './entities/Product.entity';
import { ProductAttributes } from './entities/ProductAttributes.entity';
import { QuantityType } from './entities/QuantityType.entity';
import { ReportedPosts } from './entities/ReportedPosts.entity';
import { SalesType } from './entities/SalesType.entity';
import { Size } from './entities/Size.entity';
import { SponsoredAds } from './entities/SponsoredAds.entity';
import { SubRole } from './entities/SubRole.entity';
import { Subscription } from './entities/Subscription.entity';
import { Type } from './entities/Type.entity';
import { Unit } from './entities/Unit.entity';
import { User } from './entities/User.Entity';
import { UserDealingCategory } from './entities/UserDealingcategory.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'tiles',
  // entities: ['./src/entities/*.ts'],
  entities: [
    Admin,
    AreaType,
    Attributes,
    AttributesValues,
    Banners,
    BookmarkedCatalogue,
    Catalogue,
    CatalogueSizes,
    CatalogueViewer,
    Category,
    CategorySize,
    CategoryUnit,
    Collection,
    CollectionCategory,
    Company,
    CompanyDealingCategory,
    CompanyUser,
    CompanyViewCount,
    Contact,
    Features,
    Followers,
    Grade,
    Inquiries,
    LikePosts,
    Package,
    PackageFeatures,
    Post,
    PostFeatures,
    PostViewer,
    PrivateCataloguePermission,
    Product,
    ProductAttributes,
    QuantityType,
    ReportedPosts,
    SalesType,
    Size,
    SponsoredAds,
    SubRole,
    Subscription,
    Type,
    Unit,
    User,
    UserDealingCategory,
  ],
  migrations: ['src/migrations/**/*.ts'],
  logging: true,
  synchronize: false,
});

export { AppDataSource };
