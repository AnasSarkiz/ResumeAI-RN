import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, BackHandler, ScrollView, ActionSheetIOS, Platform } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import { renderHTMLTemplate, TemplateId } from '../../services/templates';

export default function ManualHtmlEditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { currentResume, loadResume, updateResume, loading, saveNow } = useResume();

  const [editedHtml, setEditedHtml] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<boolean>(true);
  const webViewRef = useRef<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<'text' | 'align' | 'list' | 'heading' | 'color'>('text');

  // Lazy WebView import (avoid crash if not installed)
  let WebViewComp: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    WebViewComp = require('react-native-webview').WebView;
  } catch {}

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadResume(id);
    }
  }, [id]);

  // Toggle edit mode within the WebView without reloading the document
  useEffect(() => {
    try {
      if (webViewRef.current?.injectJavaScript) {
        webViewRef.current.injectJavaScript(`window.__setEditMode(${editMode ? 'true' : 'false'}); true;`);
      }
    } catch {}
  }, [editMode]);

  // Prevent leaving screen with unsaved edits
  useEffect(() => {
    const hasUnsaved = !!editedHtml && (!!currentResume ? (currentResume as any).aiHtml !== editedHtml : true);
    const onAttemptLeave = (proceed: () => void) => {
      if (!hasUnsaved) { proceed(); return; }
      Alert.alert('Unsaved changes', 'Save or discard your edits before leaving.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard', style: 'destructive', onPress: () => {
            setEditedHtml('');
            proceed();
          }
        },
        {
          text: 'Save', onPress: async () => {
            try { await onSave(); proceed(); } catch {}
          }
        }
      ]);
    };

    const sub = navigation.addListener('beforeRemove', (e: any) => {
      if (!hasUnsaved) return; // allow navigation
      e.preventDefault();
      onAttemptLeave(() => navigation.dispatch(e.data.action));
    });

    const backSub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!hasUnsaved) return false; // allow default
      onAttemptLeave(() => router.back());
      return true; // handled
    });

    return () => {
      sub && sub();
      backSub.remove();
    };
  }, [navigation, router, editedHtml, currentResume]);

  const enforceFixedViewport = (html: string): string => {
    if (!html) return html;
    const FIXED_META = `\n    <meta name="viewport" content="width=794, initial-scale=0.42, user-scalable=false" />\n  `;
    const FIXED_STYLE = '<style id="fixed-a4-reset">html, body { margin:0; padding:0; background:#f3f3f3; -webkit-text-size-adjust:100%; }</style>';
    let out = html.replace(/<meta[^>]*name=["']viewport["'][^>]*>/i, FIXED_META);
    if (!/name=["']viewport["']/i.test(out)) {
      out = out.replace(/<head(\s*)>/i, (m) => `${m}\n${FIXED_META}`);
    }
    if (!/id=["']fixed-a4-reset["']/.test(out)) {
      out = out.replace(/<head(\s*)>/i, (m) => `${m}\n${FIXED_STYLE}`);
    }
    return out;
  };

  const baseHtml = useMemo(() => {
    if (!currentResume) return '';
    return enforceFixedViewport(currentResume.html);
  }, [currentResume]);

  // Remove any editing artifacts before persisting
  const sanitizeEditedHtml = (html: string): string => {
    if (!html) return html;
    let out = html;
    // remove contenteditable attributes (true/false or without value)
    out = out.replace(/\scontenteditable(=\"?(?:true|false)\"?)?/gi, '');
    // remove our temporary data marker
    out = out.replace(/\sdata-rn-edit=\"?1\"?/gi, '');
    // remove focus style block we injected
    out = out.replace(/<style[^>]*id=["']rn-edit-focus-style["'][\s\S]*?<\/style>/i, '');
    return out;
  };

  // Keep WebView source stable while editing to avoid reloads/focus loss
  const htmlToPreview = baseHtml;

  const onSave = async () => {
    if (!currentResume) return;
    const html = sanitizeEditedHtml(editedHtml || baseHtml);
    setSaving(true);
    try {
      const toSave = {
        ...currentResume,
        kind: 'ai',
        aiHtml: html,
        updatedAt: new Date(),
      } as any;
      await saveNow(toSave);
      Alert.alert('Saved', 'Your manual edits have been saved.');
      setEditedHtml('');
    } catch (e) {
      console.error(e);
      Alert.alert('Save failed', 'There was a problem saving your edits.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !currentResume) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-800">Manual Edit</Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => setEditMode((v) => !v)}
            className={`mr-2 rounded-md px-3 py-2 ${editMode ? 'bg-amber-600' : 'bg-amber-500'}`}
          >
            <Text className="text-white">{editMode ? 'Editing On' : 'Text Edit Mode'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave} disabled={saving} className={`rounded-md px-3 py-2 ${saving ? 'bg-blue-300' : 'bg-blue-600'}`}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white">Save</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Two-tier toolbar: categories on top with undo/redo, actions below */}
      <View className="px-3 pb-1">
        {(() => {
          const [selectedCat, setSelectedCat] = [selectedCategory, setSelectedCategory];
          return (
            <View>
              {/* Top bar: categories + undo/redo */}
              <View
                className="flex-row items-center justify-between rounded-full bg-white"
                style={{ paddingHorizontal: 8, paddingVertical: 6, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 }}
              >
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ columnGap: 6, alignItems: 'center' }}>
                  {[
                    { key: 'text', label: 'Text', icon: 'text-outline' },
                    { key: 'align', label: 'Align', icon: 'menu-outline' },
                    { key: 'list', label: 'List', icon: 'list-outline' },
                    { key: 'heading', label: 'Heading', icon: 'trail-sign-outline' },
                    { key: 'color', label: 'Color', icon: 'color-palette-outline' },
                  ].map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      onPress={() => setSelectedCat(cat.key as any)}
                      className="flex-row items-center rounded-full px-3 h-9"
                      style={{ backgroundColor: selectedCat === cat.key ? '#e5e7eb' : '#f3f4f6' }}
                    >
                      <Ionicons name={cat.icon as any} size={16} color="#111827" />
                      <Text className="ml-1 text-gray-800" style={{ fontWeight: '600' }}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View className="pl-2 flex-row items-center" style={{ columnGap: 4 }}>
                  {[{ key: 'undo', icon: 'arrow-undo-outline', cmd: 'undo' }, { key: 'redo', icon: 'arrow-redo-outline', cmd: 'redo' }].map((btn) => (
                    <TouchableOpacity
                      key={btn.key}
                      onPress={() => webViewRef.current?.injectJavaScript(`(function(){ try{ if(window.__exec){ __exec('${btn.cmd}'); } }catch(e){} })(); true;`)}
                      className="h-9 w-9 rounded-full items-center justify-center"
                      style={{ backgroundColor: '#e5e7eb' }}
                      accessibilityRole="button"
                      accessibilityLabel={`hist-${btn.key}`}
                    >
                      <Ionicons name={btn.icon as any} size={18} color="#111827" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Bottom bar: actions for selected category */}
              <View className="mt-2 rounded-2xl bg-white" style={{ paddingHorizontal: 8, paddingVertical: 8, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 }}>
                {selectedCat === 'text' && (
                  <View className="flex-row items-center" style={{ columnGap: 6 }}>
                    {[{ key: 'bold', icon: 'bold', cmd: 'bold' }, { key: 'italic', icon: 'italic', cmd: 'italic' }, { key: 'underline', icon: 'underline', cmd: 'underline' }].map((btn) => (
                      <TouchableOpacity key={btn.key} onPress={() => webViewRef.current?.injectJavaScript(`(function(){ try{ if(window.__exec){ __exec('${btn.cmd}'); } }catch(e){} })(); true;`)} className="h-9 w-9 rounded-full items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
                        <FontAwesome6 name={btn.icon} size={18} color="#111827" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {selectedCat === 'align' && (
                  <View className="flex-row items-center" style={{ columnGap: 6 }}>
                    {[{ key: 'left', icon: 'align-left', cmd: 'justifyLeft' }, { key: 'center', icon: 'align-center', cmd: 'justifyCenter' }, { key: 'right', icon: 'align-right', cmd: 'justifyRight' }].map((btn) => (
                      <TouchableOpacity key={btn.key} onPress={() => webViewRef.current?.injectJavaScript(`(function(){ try{ if(window.__exec){ __exec('${btn.cmd}'); } }catch(e){} })(); true;`)} className="h-9 w-9 rounded-full items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
                        <FontAwesome6 name={btn.icon as any} size={18} color="#111827" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {selectedCat === 'list' && (
                  <View className="flex-row items-center" style={{ columnGap: 6 }}>
                    {[{ key: 'ul', icon: 'list-ol', cmd: 'insertUnorderedList' }, { key: 'ol', icon: 'list-ul', cmd: 'insertOrderedList' }].map((btn) => (
                      <TouchableOpacity key={btn.key} onPress={() => webViewRef.current?.injectJavaScript(`(function(){ try{ if(window.__exec){ __exec('${btn.cmd}'); } }catch(e){} })(); true;`)} className="h-9 w-9 rounded-full items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
                        <FontAwesome6 name={btn.icon as any} size={18} color="#111827" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {selectedCat === 'heading' && (
                  <View className="flex-row items-center" style={{ columnGap: 6 }}>
                    {[{ key: 'p', label: 'P', val: 'P' }, { key: 'h1', label: 'H1', val: 'H1' }, { key: 'h2', label: 'H2', val: 'H2' }, { key: 'h3', label: 'H3', val: 'H3' }].map((b) => (
                      <TouchableOpacity key={b.key} onPress={() => webViewRef.current?.injectJavaScript(`(function(){ try{ if(window.__exec){ __exec('formatBlock', '${b.val}'); } }catch(e){} })(); true;`)} className="h-9 px-3 rounded-full items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
                        <Text className="text-gray-800" style={{ fontWeight: '700' }}>{b.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {selectedCat === 'color' && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ columnGap: 8 }}>
                    {['#111827','#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899','#6b7280','#000000','#ffffff'].map((hex) => (
                      <TouchableOpacity key={hex} onPress={() => webViewRef.current?.injectJavaScript(`(function(){ try{ if(window.__exec){ __exec('foreColor', '${hex}'); } }catch(e){} })(); true;`)} style={{ width: 28, height: 28, borderRadius: 18, backgroundColor: hex, borderWidth: hex === '#ffffff' ? 1 : 0, borderColor: '#e5e7eb' }} />
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>
          );
        })()}
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <Text className="mb-2 text-sm text-gray-500">Tap text in the preview to edit</Text>
        <View className="mb-4 h-[520px] overflow-hidden rounded-lg bg-white">
          {WebViewComp ? (
            <WebViewComp
              ref={webViewRef}
              originWhitelist={["*"]}
              source={{ html: htmlToPreview }}
              style={{ flex: 1 }}
              scrollEnabled={true}
              javaScriptEnabled
              domStorageEnabled
              onMessage={(e: any) => {
                try {
                  const data = JSON.parse(e?.nativeEvent?.data || '{}');
                  if (data?.type === 'htmlUpdated' && typeof data?.payload?.html === 'string') {
                    setEditedHtml(data.payload.html);
                  }
                } catch {}
              }}
              injectedJavaScript={`(function(){
                var EDIT_MODE = true; // start editable by default; RN can toggle via __setEditMode
                var SELECTORS = 'p, li, h1, h2, h3, h4, h5, h6';
                var FOCUS_STYLE_ID = 'rn-edit-focus-style';
                function addFocusStyle(){
                  if(document.getElementById(FOCUS_STYLE_ID)) return;
                  var st=document.createElement('style');
                  st.id=FOCUS_STYLE_ID; st.textContent='[contenteditable="true"]:focus{outline:1.5px dashed #92c5ff; outline-offset:2px;}';
                  document.head.appendChild(st);
                }
                function enableEditing(){
                  addFocusStyle();
                  document.querySelectorAll(SELECTORS).forEach(function(el){
                    el.setAttribute('contenteditable','true');
                    el.setAttribute('data-rn-edit','1');
                  });
                }
                function disableEditing(){
                  document.querySelectorAll('[data-rn-edit="1"]').forEach(function(el){
                    el.removeAttribute('contenteditable');
                    el.removeAttribute('data-rn-edit');
                  });
                }
                // Expose a global to toggle without reload
                window.__setEditMode = function(flag){
                  try { EDIT_MODE = !!flag; } catch(e){}
                  if(EDIT_MODE){ enableEditing(); } else { disableEditing(); }
                };
                // Bridge for formatting commands
                window.__exec = function(cmd, val){
                  try {
                    // Ensure we are in edit mode so execCommand works
                    if(!EDIT_MODE){ window.__setEditMode(true); }
                    var command = String(cmd||'');
                    var value = (typeof val!== 'undefined' ? val : null);
                    if(command === 'formatBlock'){
                      // WebKit expects a block tag name like H1/H2/H3
                      document.execCommand('formatBlock', false, value || 'P');
                    } else {
                      document.execCommand(command, false, value);
                    }
                  } catch(e) {}
                };
                function post(html){
                  try{window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({type:'htmlUpdated', payload:{html:html}}));}catch(e){}
                }
                var t=null; var DEBOUNCE=400;
                function schedule(){
                  if(t) clearTimeout(t);
                  t=setTimeout(function(){
                    document.querySelectorAll('[data-rn-edit="1"]').forEach(function(el){ el.removeAttribute('data-rn-edit'); });
                    var html=document.documentElement.outerHTML;
                    document.querySelectorAll(SELECTORS).forEach(function(el){ if(el.hasAttribute('contenteditable')) el.setAttribute('data-rn-edit','1'); });
                    post(html);
                  }, DEBOUNCE);
                }
                function attach(){
                  document.addEventListener('input', function(e){
                    var t=e && e.target; if(!t) return; if(t.getAttribute && t.getAttribute('contenteditable')==='true'){ schedule(); }
                  }, true);
                  document.addEventListener('blur', function(e){
                    var t=e && e.target; if(!t) return; if(t.getAttribute && t.getAttribute('contenteditable')==='true'){ schedule(); }
                  }, true);
                }
                function init(){
                  if(EDIT_MODE){ enableEditing(); } else { disableEditing(); }
                  attach();
                }
                if(document.readyState==='loading'){
                  document.addEventListener('DOMContentLoaded', init);
                } else {
                  init();
                }
              })(); true;`}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">WebView not installed</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
