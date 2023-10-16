import React from 'react';
import Button from "@mui/material/Button";
import {AddAPhoto, CheckCircle, CheckCircleOutline, DeleteOutline} from "@mui/icons-material";
import {IconButton, ImageList, ImageListItem, ImageListItemBar, Tooltip, tooltipClasses} from "@mui/material";
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

const ImageUpload = ({images, setImages, setMainImage, previewImages, setPreviewImages}) => {


    const selectImage = (event) => {
        const imagesFiles = Array.from(event.target.files);
        imagesFiles.forEach(image => {
            setImages(images => {
                return [...images, image];
            })
            setPreviewImages(previewImages => {
                return [...previewImages, {image: URL.createObjectURL(image), fileName: image.name, isMain: false}];
            })
        })
    }

    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setPreviewImages((prevPreviewImages) => prevPreviewImages.filter((_, i) => i !== index));
    };

    const handleChangeMain = (index) => {
        const images = previewImages.map((image, i) => {
            return {...image, isMain: index === i ? !image.isMain : false}
        });
        setPreviewImages(images);
        setMainImage(images[index].fileName);
    }

    return (
        <React.Fragment>
            {previewImages && <ImageList cols={previewImages.length > 0 ? 2 : 1} sx={{margin: "20px 0"}} rowHeight={150} gap={10}>
                {previewImages.map((item, index) =>
                    <ImageListItem key={index}>
                        <ImageListItemBar
                            actionIcon={
                                <React.Fragment>
                                    <IconButton onClick={() => handleChangeMain(index)}>
                                        {item.isMain ?
                                            <LightTooltip title="Главное фото" placement="top" enterDelay={500}>
                                                <CheckCircle  sx={{color: "#6cf538"}} />
                                            </LightTooltip>
                                            :
                                            <LightTooltip title="Сделать главной" placement="top" enterDelay={500}>
                                                <CheckCircleOutline sx={{color: "white"}} />
                                            </LightTooltip>
                                        }
                                    </IconButton>

                                    {/*<IconButton><Chip label="главная" size="small" sx={{backgroundColor: "white", color: "black"}}/></IconButton>*/}
                                    <IconButton sx={{color: "white"}} onClick={() => handleRemoveImage(index)}><DeleteOutline/></IconButton>
                                </React.Fragment>
                            }
                            sx={{
                                height: "30%",
                            }}
                        />
                        <img src={item.image} height="100%" width="100%" style={{height: "100%", width: "100%", objectFit: "cover"}} alt="" />
                    </ImageListItem>
                )}
                <ImageListItem >
                    <Button
                        component="label"
                        sx={{
                            height: "100%",
                            border: "thin dashed",
                            borderColor: "rgba(0,0,0,0.4)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <VisuallyHiddenInput type="file" multiple accept="image/png, image/jpeg" onChange={selectImage} />
                        <AddAPhoto fontSize="large" sx={{color: "rgba(0,0,0,0.6)"}} />
                    </Button>
                </ImageListItem>
            </ImageList>}
        </React.Fragment>
    );
};

export default ImageUpload;