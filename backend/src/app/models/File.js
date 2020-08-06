import Sequelize, { Model } from 'sequelize';
import aws from 'aws-sdk';

const s3 = new aws.S3();

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_IMAGE_URL}/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeDestroy', async (file) => {
      const response = await s3
        .deleteObject({
          Bucket: 'upload-helppet',
          Key: file.path,
        })
        .promise();

      return response;
    });

    return this;
  }
}

export default File;
