"use client";

import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type Editorjs from '@editorjs/editorjs'
import { uploadFiles } from "@/lib/uploadthing";

interface EditorProps {
  subredditId: string;
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<
    PostCreationRequest
  >({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null
    }
  });
  
  
  const ref = useRef<Editorjs>();
  
    const [isMounted, setIsMounted] = useState<boolean>(false);
  
    // useEffect(() => {
    //   if (typef window !== 'undefined') setIsMounted(true)
    // },[])

  const initializeEditor = useCallback(async () => {
    const EditorJs = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if(!ref.current){
        const editor = new EditorJs({
            holder: 'editor',
            onReady() {
                ref.current = editor;
            },
            placeholder:'Type here to write your post',
            inlineToolbar: true,
            data: {blocks:[]},
            tools: {
                header: Header,
                linkTool: {
                    class: LinkTool,
                    config: {
                        endpoint: 'api/link'
                    }
                },
                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            async uploadByFile(file: File){
                                const [res] = await uploadFiles([file], 'imageUploader')
                                return {
                                    success: 1,
                                    file: {
                                        url: res.fileUrl
                                    }
                                }
                            },

                        }
                    }
                },
                list: List,
                code: Code,
                inlineCode: InlineCode,
                table: Table,
                embed: Embed
            }
        })
    }
  },[])

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border-zinc-200">
      <form id="subreddit-post-form" className="w-fit" onSubmit={() => {}}>
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            placeholder="Title"
            className="w-full resize-none appearence-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
};

export default Editor;